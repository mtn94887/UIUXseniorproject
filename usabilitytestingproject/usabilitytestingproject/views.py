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
from .models import Project
from .serializers import ProjectSerializer
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


# MediaPipe setup for face detection
mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils
face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.2)

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

@csrf_exempt  # Temporarily exempt from CSRF checks
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

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                ih, iw, _ = image.shape
                min_x = iw
                min_y = ih
                max_x = 0
                max_y = 0

                for lm in face_landmarks.landmark:
                    x, y = int(lm.x * iw), int(lm.y * ih)
                    landmarks_data.append({'x': x, 'y': y})

                    # Update bounding box coordinates
                    min_x = min(min_x, x)
                    min_y = min(min_y, y)
                    max_x = max(max_x, x)
                    max_y = max(max_y, y)

                bounding_box = {'x': min_x, 'y': min_y, 'width': max_x - min_x, 'height': max_y - min_y}

            # Crop face for emotion analysis using DeepFace (optional)
            try:
                analysis = DeepFace.analyze(image, actions=['emotion'], enforce_detection=False)
                emotion = analysis[0]['dominant_emotion']
            except Exception as e:
                emotion = 'Unable to detect emotion'

        return JsonResponse({'emotion': emotion, 'landmarks': landmarks_data, 'bounding_box': bounding_box})

    return JsonResponse({'error': 'Invalid request'}, status=400)


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
