"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path

# urlpatterns = [
#     path("admin/", admin.site.urls),
# ]

# from django.urls import path
# from django.http import JsonResponse
# from backend.views import ProjectCreateView
# from django.views.generic import TemplateView

# urlpatterns = [
#     # path('', lambda request: JsonResponse({'message': 'Welcome to the API'})),  # Root URL placeholder
#     path('', TemplateView.as_view(template_name='index.html')),  # React index

#     path('create-project/', ProjectCreateView.as_view(), name='create-project'),
# ]

# from django.urls import path
# from .views import index
# from backend.views import ProjectCreateView

# urlpatterns = [
#     path('', index, name='home'),  # Serve React's index.html at the root URL
#     path('create-project/', ProjectCreateView.as_view(), name='create-project'),
# ]


import os
from django.contrib import admin 
from django.urls import path 
from . import views 
from django.views.generic import TemplateView
from django.urls import re_path

from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name ='index'),
    path('create-project/', views.create_project, name='create_project'),
    path('list-projects/', views.list_projects, name='list_projects'),
    path('list-projects/<int:id>/', views.project_detail, name='project_detail'),  
    path('submit-task/', views.submit_task, name='submit_task'),
    path('list-tasks/', views.list_tasks, name='list_tasks'),  # Add this line for the task listing API
    path('delete-task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('emotion-detection/', views.emotion_detection, name='emotion_detection'),
    path('emotion-detection-light/', views.emotion_detection_lightweight, name='emotion_detection_lightweight'),
    path('upload-photo/', views.upload_photo, name='upload_photo'),

    re_path(r'^(?!admin).*$', TemplateView.as_view(template_name='index.html')),
]

urlpatterns += static('/assets/', document_root=os.path.join(os.path.dirname(__file__), 'assets'))
