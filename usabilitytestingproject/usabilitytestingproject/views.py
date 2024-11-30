# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Project
# from .serializers import ProjectSerializer

# class ProjectCreateView(APIView):
#     def post(self, request):
#         serializer = ProjectSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# from django.shortcuts import render

# def index(request):
#     return render(request, 'index.html')



from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

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