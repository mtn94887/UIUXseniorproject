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

def index(request):
    return render(request, 'index.html')