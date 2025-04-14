from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserSerializer, ServiceCategorySerializer, JobSerializer
from .models import ServiceCategory, User, Job, JobAcceptance


# Create your views here.
def index(request):
    return JsonResponse({"message": "Hello, world!", "status": "success"})


class UserSignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if request.data.get("user_type") == "worker":
                user.is_worker = True
                user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
            return Response(
                {
                    "message": "Login successful",
                    "is_worker": user.is_worker,
                    "status": "success",
                    "client_id": user.id,
                    "pincode": user.pincode,
                },
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            return Response(
                {"message": "User not found", "status": "error"},
                status=status.HTTP_404_NOT_FOUND,
            )


class ServiceCategoryListView(APIView):
    def get(self, request):
        categories = ServiceCategory.objects.all()
        serializer = ServiceCategorySerializer(categories, many=True)
        return Response(serializer.data)


class JobCreateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        job_data = request.data.copy()

        try:
            user = User.objects.get(id=job_data.get("client"))
        except User.DoesNotExist:
            return Response(
                {"message": "User not found", "status": "error"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            category = ServiceCategory.objects.get(id=job_data.get("service_category"))
        except ServiceCategory.DoesNotExist:
            return Response(
                {"message": "Service category not found", "status": "error"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = JobSerializer(data=job_data)
        if serializer.is_valid():
            job = serializer.save()
            return Response(
                {
                    "message": "Job created successfully",
                    "data": serializer.data,
                    "status": "success",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"message": "Invalid data", "errors": serializer.errors, "status": "error"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class JobsByClientView(APIView):
    def get(self, request):
        client_id = request.query_params.get("client_id")
        if not client_id:
            return Response(
                {"message": "Client ID is required", "status": "error"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            jobs = Job.objects.filter(client=client_id)
            serializer = JobSerializer(jobs, many=True)
            return Response(
                {
                    "message": "Jobs fetched successfully",
                    "data": serializer.data,
                    "status": "success",
                }
            )
        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class JobsForSeekersView(APIView):
    def get(self, request):
        try:
            # Get filter parameters from query string
            service_category = request.query_params.get("service_category")
            location = request.query_params.get("location")

            # Start with all jobs that are not completed
            jobs = Job.objects.filter(is_completed=False)

            # Apply filters if provided
            if service_category:
                jobs = jobs.filter(service_category=service_category)
            if location:
                jobs = jobs.filter(location=location)

            # Order by most recent first
            jobs = jobs.order_by("-created_at")

            serializer = JobSerializer(jobs, many=True)
            return Response(
                {
                    "message": "Jobs fetched successfully",
                    "data": serializer.data,
                    "status": "success",
                }
            )

        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class JobApplicationView(APIView):
    def post(self, request):
        try:
            job_id = request.data.get("job_id")
            user_id = request.data.get("userId")

            if not job_id or not user_id:
                return Response(
                    {"message": "Job ID and User ID are required", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if job exists
            try:
                job = Job.objects.get(id=job_id)
            except Job.DoesNotExist:
                return Response(
                    {"message": "Job not found", "status": "error"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Check if user exists
            try:
                user = User.objects.get(id=user_id, is_worker=True)
            except User.DoesNotExist:
                return Response(
                    {"message": "Worker not found", "status": "error"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Check if already applied
            if JobAcceptance.objects.filter(job=job, job_seekers=user).exists():
                return Response(
                    {"message": "Already applied to this job", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Create job application
            job_acceptance = JobAcceptance.objects.create(job=job)
            job_acceptance.job_seekers.add(user)

            return Response(
                {"message": "Application submitted successfully", "status": "success"},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class MyApplicationsView(APIView):
    def get(self, request):
        try:
            user_id = request.query_params.get("userId")
            if not user_id:
                return Response(
                    {"message": "User ID is required", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get user's applications
            user = User.objects.get(id=user_id)
            applications = JobAcceptance.objects.filter(job_seekers=user)

            # Prepare response data
            application_data = []
            for application in applications:
                job = application.job
                application_data.append(
                    {
                        "id": str(application.id),
                        "job_title": job.title,
                        "job_description": job.description,
                        "budget": str(job.budget),
                        "location": job.location,
                        "client_name": f"{job.client.first_name} {job.client.last_name}",
                        "applied_date": application.created_at,
                        "status": application.status,
                        "service_category": job.service_category.name,
                    }
                )

            return Response(
                {
                    "message": "Applications fetched successfully",
                    "data": application_data,
                    "status": "success",
                }
            )

        except User.DoesNotExist:
            return Response(
                {"message": "User not found", "status": "error"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserProfileUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        try:
            user_id = request.query_params.get("userId")
            if not user_id:
                return Response(
                    {"message": "User ID is required", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(
                {
                    "message": "Profile fetched successfully",
                    "data": serializer.data,
                    "status": "success",
                }
            )

        except User.DoesNotExist:
            return Response(
                {"message": "User not found", "status": "error"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def put(self, request):
        try:
            user_id = request.data.get("userId")
            if not user_id:
                return Response(
                    {"message": "User ID is required", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "message": "Profile updated successfully",
                        "data": serializer.data,
                        "status": "success",
                    }
                )
            return Response(
                {
                    "message": "Invalid data",
                    "errors": serializer.errors,
                    "status": "error",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except User.DoesNotExist:
            return Response(
                {"message": "User not found", "status": "error"},
                status=status.HTTP_404_NOT_FOUND,
            )
