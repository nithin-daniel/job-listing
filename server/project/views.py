from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse
from .serializers import (
    UserSerializer,
    OfferSerializer,
    JobSerializer,
    JobImageSerializer,
)
from .models import User, Offer, Job, JobImage
from django.contrib.auth.hashers import check_password

# Create your views here.


@csrf_exempt
@api_view(["POST", "OPTIONS"])
@permission_classes([AllowAny])
def signup(request):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Accept"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

    print("Received signup request data:", request.data)
    serializer = UserSerializer(data=request.data)

    if not serializer.is_valid():
        print("Validation errors:", serializer.errors)
        response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        response["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

    serializer.save()
    response = Response(serializer.data, status=status.HTTP_201_CREATED)
    response["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response["Access-Control-Allow-Credentials"] = "true"
    return response


@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED
        )

    if check_password(password, user.password):
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(
        {"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(["GET", "POST"])
def offer_list(request):
    if request.method == "GET":
        # Get query parameters
        job_id = request.query_params.get("job_id")
        worker_id = request.query_params.get("worker_id")

        # Build query
        offers = Offer.objects.all()
        if job_id:
            offers = offers.filter(job_id=job_id)
        if worker_id:
            offers = offers.filter(worker_id=worker_id)

        serializer = OfferSerializer(offers, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = OfferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PATCH"])
def offer_detail(request, offer_id):
    offer = get_object_or_404(Offer, id=offer_id)

    if request.method == "GET":
        serializer = OfferSerializer(offer)
        return Response(serializer.data)

    elif request.method == "PATCH":
        # Get the user from the request data
        user_id = request.data.get("user_id")
        if not user_id:
            return Response(
                {"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Validate user permissions
        if not (
            str(user_id) == str(offer.worker.id)
            or str(user_id) == str(offer.job.client.id)
        ):
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Determine which fields the user can update
        allowed_fields = []
        if str(user_id) == str(offer.worker.id):
            allowed_fields = ["worker_accepted", "is_completed"]
        elif str(user_id) == str(offer.job.client.id):
            allowed_fields = ["client_accepted"]

        # Filter request data to only include allowed fields
        valid_data = {k: v for k, v in request.data.items() if k in allowed_fields}

        serializer = OfferSerializer(offer, data=valid_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def user_list(request):
    """Get all users with optional filtering"""
    # Get query parameters
    is_worker = request.query_params.get("is_worker")
    city = request.query_params.get("city")
    service_category = request.query_params.get("service_category")

    # Build query
    users = User.objects.all()
    if is_worker is not None:
        users = users.filter(is_worker=is_worker.lower() == "true")
    if city:
        users = users.filter(city=city)
    if service_category:
        users = users.filter(service_category=service_category)

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def user_detail(request, user_id):
    """Get details of a specific user"""
    user = get_object_or_404(User, id=user_id)
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(["GET", "POST"])
def job_list(request):
    if request.method == "GET":
        # Get query parameters
        client_id = request.query_params.get("client_id")
        service_category = request.query_params.get("service_category")
        location = request.query_params.get("location")

        # Build query
        jobs = Job.objects.all()
        if client_id:
            jobs = jobs.filter(client_id=client_id)
        if service_category:
            jobs = jobs.filter(service_category=service_category)
        if location:
            jobs = jobs.filter(location=location)

        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        return create_job(request)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def job_detail(request, job_id):
    job = get_object_or_404(Job, id=job_id)

    if request.method == "GET":
        serializer = JobSerializer(job)
        return Response(serializer.data)

    elif request.method in ["PUT", "PATCH"]:
        # Verify that the user is the job owner
        user_id = request.data.get("user_id")
        if str(user_id) != str(job.client.id):
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = JobSerializer(
            job, data=request.data, partial=request.method == "PATCH"
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        # Verify that the user is the job owner
        user_id = request.query_params.get("user_id")
        if str(user_id) != str(job.client.id):
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def create_job(request):
    # First, create the job
    job_data = {
        "title": request.data.get("title"),
        "description": request.data.get("description"),
        "client": request.data.get("client"),
        "service_category": request.data.get("service_category"),
        "budget": request.data.get("budget"),
        "location": request.data.get("location"),
    }

    job_serializer = JobSerializer(data=job_data)
    if job_serializer.is_valid():
        job = job_serializer.save()

        # Handle multiple image uploads
        images = request.FILES.getlist("images")
        for image in images:
            JobImage.objects.create(job=job, image=image)

        # Get updated job with images
        updated_serializer = JobSerializer(job)
        return Response(updated_serializer.data, status=status.HTTP_201_CREATED)

    return Response(job_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
