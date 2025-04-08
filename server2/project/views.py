from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserSerializer, ServiceCategorySerializer, JobSerializer
from .models import ServiceCategory, User, Job


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
