# from django.shortcuts import render
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Project
# from .serializers import ProjectSerializer
# from django.http import JsonResponse
# from django.shortcuts import get_object_or_404

# def index(request):
#     return render(request, 'index.html')

# @api_view(['POST'])
# def create_project(request):
#     serializer = ProjectSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     print(serializer.errors)
#     return Response(serializer.errors, status=400)

# @api_view(['GET'])
# def list_projects(request):
#     projects = Project.objects.all()
#     serializer = ProjectSerializer(projects, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# def project_detail(request, id):
#     project = get_object_or_404(Project, id=id)  # Ensure it raises 404 if the project does not exist
#     return JsonResponse({
#         'id': project.id,
#         'project_name': project.project_name,
#         'website_url': project.website_url,
#         'description': project.description,
#         'sample_size': project.sample_size,
#     })


from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Project,Task 
from .serializers import ProjectSerializer, TaskSerializer
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt


import cv2
import mediapipe as mp
import numpy as np
from deepface import DeepFace
from django.http import JsonResponse
import base64
from io import BytesIO
from PIL import Image

import threading
import time


from django.core.files.storage import FileSystemStorage
import os


# MediaPipe setup for face detection
mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils
# face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.2) #heavy-weight
face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.3) #light weight

# Use a global variable to cache emotion
last_detected_emotion = None #lightweight
emotion_last_updated = time.time() #lightweight


# Define the path for saving uploaded files
ASSETS_DIR = os.path.join(os.path.dirname(__file__), 'assets')

# Ensure the assets directory exists
if not os.path.exists(ASSETS_DIR):
    os.makedirs(ASSETS_DIR)

def index(request):
    return render(request, 'index.html')

@api_view(['POST'])
def create_project(request):
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    print(serializer.errors)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def submit_task(request):
    # Parse task data from request
    task_number = request.data.get('task_number')
    task_name = request.data.get('task_name')
    participant_name = request.data.get('participant_name')

    # Validate fields
    if not task_number or not task_name or not participant_name:
        return JsonResponse({'error': 'All fields are required.'}, status=400)

    # Create new task
    task = Task.objects.create(
        task_number=task_number,
        task_name=task_name,
        participant_name=participant_name,
    )

    # Return a success message
    return JsonResponse({'message': 'Task submitted successfully!'}, status=201)

@api_view(['GET'])
def list_projects(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def project_detail(request, id):
    project = get_object_or_404(Project, id=id)  # Ensure it raises 404 if the project does not exist
    return JsonResponse({
        'id': project.id,
        'project_name': project.project_name,
        'website_url': project.website_url,
        'description': project.description,
        'sample_size': project.sample_size,
    })

@csrf_exempt
@api_view(['POST'])
def submit_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'message': 'Task submitted successfully!'}, status=201)
    return JsonResponse(serializer.errors, status=400)

@api_view(['GET'])
def list_tasks(request):
    tasks = Task.objects.all()  # Fetch all tasks from the database
    serializer = TaskSerializer(tasks, many=True)  # Serialize the tasks
    return JsonResponse(serializer.data, safe=False)  # Return tasks as JSON response

@api_view(['DELETE'])
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.delete()  # Delete the task from the database
    return Response({'message': 'Task deleted successfully!'}, status=204)

# heavy weight code 
@csrf_exempt
@api_view(['POST'])
def emotion_detection(request):
    if request.method == 'POST':
        # Get the base64 image from the frontend
        image_data = request.data.get('image').split(',')[1]  # Remove the base64 prefix
        image_bytes = base64.b64decode(image_data)
        
        # Convert the bytes to an OpenCV image
        image = Image.open(BytesIO(image_bytes))
        image = np.array(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # Convert to BGR format for OpenCV

        # Use MediaPipe Face Mesh for detailed facial landmarks
        mp_face_mesh = mp.solutions.face_mesh
        face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, min_detection_confidence=0.5)
        results = face_mesh.process(image)

        landmarks_data = []
        bounding_box = None
        emotion = 'No emotion detected'
        connections = []  # To store landmark connections for drawing

        # Predefined indices for specific facial regions (eyes, mouth, etc.)
        FACE_REGIONS = {
            'face_boundary': mp_face_mesh.FACEMESH_FACE_OVAL,
            'left_eye': mp_face_mesh.FACEMESH_LEFT_EYE,
            'right_eye': mp_face_mesh.FACEMESH_RIGHT_EYE,
            'left_eyebrow': mp_face_mesh.FACEMESH_LEFT_EYEBROW,
            'right_eyebrow': mp_face_mesh.FACEMESH_RIGHT_EYEBROW,
            'mouth': mp_face_mesh.FACEMESH_LIPS,
            'nose': mp_face_mesh.FACEMESH_NOSE,
        }

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                ih, iw, _ = image.shape
                min_x = iw
                min_y = ih
                max_x = 0
                max_y = 0

                # Process each landmark and calculate bounding box
                for lm in face_landmarks.landmark:
                    x, y = int(lm.x * iw), int(lm.y * ih)
                    landmarks_data.append({'x': x, 'y': y})
                    min_x = min(min_x, x)
                    min_y = min(min_y, y)
                    max_x = max(max_x, x)
                    max_y = max(max_y, y)

                # Create the bounding box
                bounding_box = {'x': min_x, 'y': min_y, 'width': max_x - min_x, 'height': max_y - min_y}

                # Add connections for each region
                for region, indices in FACE_REGIONS.items():
                    for start_idx, end_idx in indices:
                        connections.append({'start': start_idx, 'end': end_idx})

            # Perform emotion analysis using DeepFace (optional)
            try:
                analysis = DeepFace.analyze(image, actions=['emotion'], enforce_detection=False)
                emotion = analysis[0]['dominant_emotion']
                emotion_probabilities = analysis[0]['emotion']  # Add probabilities
            except Exception as e:
                emotion = 'Unable to detect emotion'
                emotion_probabilities = {}

        return JsonResponse({'emotion': emotion, 'landmarks': landmarks_data, 'bounding_box': bounding_box, 'connections': connections, 'emotion_probabilities': emotion_probabilities})

    return JsonResponse({'error': 'Invalid request'}, status=400)


# light wegiht 
@csrf_exempt
@api_view(['POST'])
def emotion_detection_lightweight(request):
    if request.method == 'POST':
        # Get the base64 image from the frontend
        image_data = request.data.get('image').split(',')[1]  # Remove the base64 prefix
        image_bytes = base64.b64decode(image_data)
        
        # Convert the bytes to an OpenCV image
        image = Image.open(BytesIO(image_bytes))
        image = np.array(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # Convert to BGR format for OpenCV

        # Use MediaPipe Face Mesh for detailed facial landmarks
        mp_face_mesh = mp.solutions.face_mesh
        face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, min_detection_confidence=0.5)
        results = face_mesh.process(image)

        landmarks_data = []
        bounding_box = None
        emotion = 'No emotion detected'
        connections = []  # To store landmark connections for drawing

        # Predefined indices for specific facial regions (eyes, mouth, etc.)
        FACE_REGIONS = {
            'face_boundary': mp_face_mesh.FACEMESH_FACE_OVAL,
            'left_eye': mp_face_mesh.FACEMESH_LEFT_EYE,
            'right_eye': mp_face_mesh.FACEMESH_RIGHT_EYE,
            'left_eyebrow': mp_face_mesh.FACEMESH_LEFT_EYEBROW,
            'right_eyebrow': mp_face_mesh.FACEMESH_RIGHT_EYEBROW,
            'mouth': mp_face_mesh.FACEMESH_LIPS,
            'nose': mp_face_mesh.FACEMESH_NOSE,
        }

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                ih, iw, _ = image.shape
                min_x = iw
                min_y = ih
                max_x = 0
                max_y = 0

                # Process each landmark and calculate bounding box
                for lm in face_landmarks.landmark:
                    x, y = int(lm.x * iw), int(lm.y * ih)
                    landmarks_data.append({'x': x, 'y': y})
                    min_x = min(min_x, x)
                    min_y = min(min_y, y)
                    max_x = max(max_x, x)
                    max_y = max(max_y, y)

                # Create the bounding box
                bounding_box = {'x': min_x, 'y': min_y, 'width': max_x - min_x, 'height': max_y - min_y}

                # Add connections for each region
                for region, indices in FACE_REGIONS.items():
                    for start_idx, end_idx in indices:
                        connections.append({'start': start_idx, 'end': end_idx})

            # Since we are skipping DeepFace emotion analysis, use a placeholder for emotion
            emotion = 'Neutral'  # Placeholder; you can implement your own emotion detection if needed
            emotion_probabilities = {'neutral': 1.0}

        return JsonResponse({
            'emotion': emotion,
            'landmarks': landmarks_data,
            'bounding_box': bounding_box,
            'connections': connections,
            'emotion_probabilities': emotion_probabilities
        })

    return JsonResponse({'error': 'Invalid request'}, status=400)


#light weight code 
# @csrf_exempt
# @api_view(['POST'])
# def emotion_detection(request):
#     global last_detected_emotion, emotion_last_updated
#     if request.method == 'POST':
#         # Get the base64 image from the frontend
#         image_data = request.data.get('image').split(',')[1]  # Remove the base64 prefix
#         image_bytes = base64.b64decode(image_data)
        
#         # Convert the bytes to an OpenCV image
#         image = Image.open(BytesIO(image_bytes))
#         image = np.array(image)
#         image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # Convert to BGR format for OpenCV
        
#         # Resize image to reduce computational load
#         image = cv2.resize(image, (640, 480))  # Resize to a smaller resolution

#         # Use MediaPipe Face Detection
#         results = face_detection.process(image)

#         if results.detections:
#             # Perform emotion analysis using DeepFace (only if enough time has passed)
#             if time.time() - emotion_last_updated > 2:  # Update every 2 seconds
#                 # Using 'opencv' backend for emotion analysis
#                 analysis = DeepFace.analyze(image, actions=['emotion'], enforce_detection=False, detector_backend='opencv')
#                 emotion = analysis[0]['dominant_emotion']
#                 emotion_last_updated = time.time()
#                 last_detected_emotion = emotion
#             else:
#                 emotion = last_detected_emotion
#         else:
#             emotion = 'No face detected'

#         return JsonResponse({'emotion': emotion})

#     return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def upload_photo(request):
    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES['file']
        fs = FileSystemStorage(location=ASSETS_DIR)  # Specify the save location
        filename = fs.save(file.name, file)  # Save the uploaded file
        file_url = f'/assets/{filename}'  # Relative URL for accessing the file
        return JsonResponse({'file_path': file_url})
    return JsonResponse({'error': 'Invalid request'}, status=400)


# @csrf_exempt  # Temporarily exempt from CSRF checks
# @api_view(['POST'])  
# def emotion_detection(request):
#     if request.method == 'POST':
#         # Get the base64 image from the frontend
#         image_data = request.data.get('image').split(',')[1]  # Remove the base64 prefix
#         image_bytes = base64.b64decode(image_data)
        
#         # Convert the bytes to an OpenCV image
#         image = Image.open(BytesIO(image_bytes))
#         image = np.array(image)
#         image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # Convert to BGR format for OpenCV

#         # Detect faces in the frame using MediaPipe
#         results = face_detection.process(image)

#         if results.detections:
#             landmarks_data = []
#             for detection in results.detections:
#                 bboxC = detection.location_data.relative_bounding_box
#                 ih, iw, _ = image.shape
#                 x, y, w, h = int(bboxC.xmin * iw), int(bboxC.ymin * ih), int(bboxC.width * iw), int(bboxC.height * ih)
#                 #face = image[y:y+h, x:x+w]

#                 # Extract facial landmarks
#                 keypoints = [
#                     {
#                         'x': int(kp.x * iw),
#                         'y': int(kp.y * ih)
#                     }
#                     for kp in detection.location_data.relative_keypoints
#                 ]
#                 landmarks_data.append({'bbox': [x, y, w, h], 'keypoints': keypoints})

#                 # Use DeepFace for emotion detection on the cropped face
#                 try:
#                     face = image[y:y+h, x:x+w]
#                     analysis = DeepFace.analyze(face, actions=['emotion'], enforce_detection=False)
#                     emotion = analysis[0]['dominant_emotion']
#                 except Exception as e:
#                     emotion = 'Unable to detect emotion'
#             return JsonResponse({'emotion': emotion, 'landmarks': landmarks_data})
#         else:
#             return JsonResponse({'emotion': 'No face detected', 'landmarks': []})
#     return JsonResponse({'error': 'Invalid request'}, status=400)


# @api_view(['POST'])
# def emotion_detection(request):
#     if request.method == 'POST':
#         image_data = request.data.get('image').split(',')[1]  # Remove base64 prefix
#         image_bytes = base64.b64decode(image_data)

#         image = Image.open(BytesIO(image_bytes))
#         image = np.array(image)
#         image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # Convert to BGR for OpenCV

#         try:
#             analysis = deepface.analyze(image, actions=['emotion'], enforce_detection=False)
#             emotion = analysis[0]['dominant_emotion']
#         except Exception as e:
#             emotion = 'Unable to detect emotion'

#         return JsonResponse({'emotion': emotion})
#     return JsonResponse({'error': 'Invalid request'}, status=400)
