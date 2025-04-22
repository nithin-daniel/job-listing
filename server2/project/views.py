from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import (
    UserSerializer,
    ServiceCategorySerializer,
    JobSerializer,
    JobAcceptanceSerializer,
    ComplaintSerializer,
)
from .models import (
    ServiceCategory,
    User,
    Job,
    JobAcceptance,
    Complaint,
    AdminRegistrationCode,
)
from django.utils import timezone


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
            else:
                user.is_verified = True
                user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
            if not user.is_verified:
                return Response(
                    {"message": "Your account needs admin approval", "status": "error"},
                    status=status.HTTP_403_FORBIDDEN,
                )
            return Response(
                {
                    "message": "Login successful",
                    "user_full_name": user.full_name,
                    "is_worker": user.is_worker,
                    "is_admin": user.is_admin,
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


class NonVerifiedUsersView(APIView):
    def get(self, request):
        try:
            # Get all non-verified users
            non_verified_users = User.objects.filter(is_verified=False)

            # Serialize the users
            serializer = UserSerializer(non_verified_users, many=True)

            return Response(
                {
                    "message": "Non-verified users fetched successfully",
                    "data": serializer.data,
                    "status": "success",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AcceptUserView(APIView):
    def patch(self, request):
        try:
            user_id = request.data.get("userId")
            if not user_id:
                return Response(
                    {"message": "User ID is required", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.get(id=user_id)
            user.is_verified = True
            user.save()

            return Response(
                {"message": "User accepted successfully", "status": "success"},
                status=status.HTTP_200_OK,
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
            user = User.objects.get(id=job_data.get("user"))
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


class UserPostedJobsView(APIView):
    def get(self, request):
        user_id = request.query_params.get("userId")
        if not user_id:
            return Response(
                {"message": "User ID is required", "status": "error"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            jobs = Job.objects.filter(user_id=user_id).order_by("-created_at")
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
            user_id = request.query_params.get("userId")

            # if not user_id:
            #     return Response(
            #         {"message": "User ID is required", "status": "error"},
            #         status=status.HTTP_400_BAD_REQUEST,
            #     )

            # Start with all jobs that are not completed
            jobs = Job.objects.filter(is_completed=False)

            # Get all job IDs that the user has already applied for
            applied_job_ids = JobAcceptance.objects.filter(
                job_seekers__id=user_id
            ).values_list("job_id", flat=True)

            # Exclude jobs that the user has already applied for
            jobs = jobs.exclude(id__in=applied_job_ids)

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
            if not applications.exists():
                applications = JobAcceptance.objects.filter(assigned_to=user)

            # Prepare response data
            application_data = []
            for application in applications:
                job = application.job
                application_data.append(
                    {
                        "id": str(application.id),  # Convert UUID to string
                        "job_title": job.title,
                        "job_description": job.description,
                        "budget": float(job.budget),  # Convert Decimal to float
                        "location": job.location,
                        "client_name": job.user.full_name,  # Changed from client to user
                        "applied_date": application.created_at.isoformat(),  # Format datetime
                        "status": application.status,
                        "service_category": (
                            job.service_category.name if job.service_category else None
                        ),
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
            user_id = request.query_params.get("userId")
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


class RequestedApplicationsView(APIView):
    def get(self, request):
        try:
            user_id = request.query_params.get("userId")
            if not user_id:
                return Response(
                    {"message": "User ID is required", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get jobs posted by the user
            user_jobs = Job.objects.filter(user_id=user_id)

            # Get all applications for those jobs
            applications_data = []
            for job in user_jobs:
                job_applications = JobAcceptance.objects.filter(job=job)

                for application in job_applications:
                    for seeker in application.job_seekers.all():
                        applications_data.append(
                            {
                                "application_id": str(application.id),
                                "job_title": job.title,
                                "job_description": job.description,
                                "budget": str(job.budget),
                                "application_status": application.status,
                                "applied_date": application.created_at,
                                "applicant_name": seeker.full_name,  # Changed from first_name + last_name
                                "applicant_email": seeker.email,
                                "applicant_phone": seeker.mobile_number,  # Make sure this matches your model field name
                                "service_category": job.service_category.name,
                            }
                        )

            return Response(
                {
                    "message": "Applications fetched successfully",
                    "data": applications_data,
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


class JobRequestListView(APIView):
    def get(self, request):
        try:
            job_id = request.query_params.get("job_id")
            if not job_id:
                return Response(
                    {"message": "Job ID is required", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            job_requests = JobAcceptance.objects.filter(job_id=job_id)

            requests_data = []
            for job_request in job_requests:
                # Check if job is already assigned
                if job_request.assigned_to:
                    return Response(
                        {
                            "message": "Job already assigned",
                            "data": {
                                "application_id": str(job_request.assigned_to.id),
                                "applicant_name": job_request.assigned_to.full_name,
                                "experience": job_request.assigned_to.experience
                                or "Not specified",
                                "applied_date": job_request.created_at.strftime(
                                    "%Y-%m-%d"
                                ),
                                "status": job_request.status,
                            },
                            "status": "success",
                        }
                    )

                # If not assigned, return all applicants
                for applicant in job_request.job_seekers.all():
                    requests_data.append(
                        {
                            "application_id": str(applicant.id),
                            "applicant_name": applicant.full_name,
                            "experience": applicant.experience or "Not specified",
                            "applied_date": job_request.created_at.strftime("%Y-%m-%d"),
                            "status": job_request.status,
                        }
                    )

            return Response(
                {
                    "message": "Job requests fetched successfully",
                    "data": requests_data,
                    "status": "success",
                }
            )

        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class JobRequestUpdateView(APIView):
    def post(self, request):
        try:
            job_id = request.data.get("job_id")
            applicantId = str(request.data.get("applicantId"))
            if not job_id or not applicantId:
                return Response(
                    {
                        "message": "Job ID and applicant ID are required",
                        "status": "error",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            try:
                job_request = JobAcceptance.objects.get(job__id=job_id)
                applicant = User.objects.get(id=applicantId)
            except JobAcceptance.DoesNotExist:
                return Response(
                    {"message": "Job request not found", "status": "error"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            except User.DoesNotExist:
                return Response(
                    {"message": "Applicant not found", "status": "error"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            job_request.status = "accepted"
            job_request.assigned_to = applicant
            job_request.job_seekers.remove(applicantId)
            job_request.save()

            # Prepare response data
            response_data = {
                "message": "Job request status updated successfully",
                "status": "success",
                "data": {
                    "job_request_id": str(job_request.id),
                    "job_id": str(job_request.job.id),
                    "job_title": job_request.job.title,
                    "assigned_to": {
                        "id": str(applicant.id),
                        "name": applicant.full_name,
                        "email": applicant.email,
                        "phone": applicant.mobile_number,
                    },
                    "status": job_request.status,
                },
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class JobDeleteView(APIView):
    def delete(self, request):
        try:
            job_id = request.data.get("job_id")

            job = Job.objects.get(id=job_id)
            job.delete()
            return Response(
                {"message": "Job deleted successfully", "status": "success"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class JobCompleteView(APIView):
    def post(self, request):
        try:
            job_id = request.data.get("job_id")
            user_id = request.data.get("user_id")
            if not job_id:
                return Response(
                    {"message": "Job ID is required", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the job and update its status
            job = Job.objects.get(id=job_id)
            job.is_completed = True
            job.save()
            user = User.objects.get(id=user_id)
            user.works += 1
            user.save()
            # Update the job acceptance status if it exists
            try:
                job_acceptance = JobAcceptance.objects.get(job=job)
                job_acceptance.status = "completed"
                job_acceptance.save()

                # Update the assigned worker's works count
                if job_acceptance.assigned_to:
                    worker = job_acceptance.assigned_to
                    worker.works += 1
                    worker.save()
            except JobAcceptance.DoesNotExist:
                pass  # If no job acceptance exists, that's fine

            return Response(
                {
                    "message": "Job marked as completed successfully",
                    "status": "success",
                },
                status=status.HTTP_200_OK,
            )
        except Job.DoesNotExist:
            return Response(
                {"message": "Job not found", "status": "error"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CompletedJobsView(APIView):
    def get(self, request):
        try:
            # Get all completed jobs
            jobs = Job.objects.filter(is_completed=True).order_by("-created_at")
            serializer = JobSerializer(jobs, many=True)

            return Response(
                {
                    "message": "Completed jobs fetched successfully",
                    "data": serializer.data,
                    "status": "success",
                }
            )
        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DeleteUserView(APIView):
    def delete(self, request):
        try:
            user_id = request.query_params.get("userId")
            if not user_id:
                return Response(
                    {"message": "User ID is required", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.get(id=user_id)
            user.delete()

            return Response(
                {"message": "User deleted successfully", "status": "success"},
                status=status.HTTP_200_OK,
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


class AllUsersView(APIView):
    def get(self, request):
        try:
            # Get all users
            users = User.objects.all()

            # Serialize the users
            serializer = UserSerializer(users, many=True)

            return Response(
                {
                    "message": "Users fetched successfully",
                    "data": serializer.data,
                    "status": "success",
                }
            )
        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ComplaintCreateView(APIView):
    def post(self, request):
        try:
            user_id = request.data.get("userId")
            if not user_id:
                return Response(
                    {"message": "User ID is required", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.get(id=user_id)
            serializer = ComplaintSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=user)
                return Response(
                    {
                        "message": "Complaint submitted successfully",
                        "data": serializer.data,
                        "status": "success",
                    },
                    status=status.HTTP_201_CREATED,
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
        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ComplaintsListView(APIView):
    def get(self, request):
        try:
            complaints = Complaint.objects.all().order_by("-created_at")
            serializer = ComplaintSerializer(complaints, many=True)
            return Response(
                {
                    "message": "Complaints fetched successfully",
                    "data": serializer.data,
                    "status": "success",
                }
            )
        except Exception as e:
            return Response(
                {"message": str(e), "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AdminRegistrationView(APIView):
    def post(self, request):
        try:
            # Get the registration code from request
            registration_code = request.data.get("registration_code")
            if not registration_code:
                return Response(
                    {"message": "Registration code is required", "status": "error"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validate the registration code
            try:
                admin_code = AdminRegistrationCode.objects.get(
                    code=registration_code, is_used=False
                )
            except AdminRegistrationCode.DoesNotExist:
                return Response(
                    {
                        "message": "Invalid or already used registration code",
                        "status": "error",
                        "error": "Invalid or already used registration code",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Add default values for required fields
            request.data.update(
                {
                    "user_type": "admin",
                    "is_worker": False,
                    "is_verified": True,
                    "is_admin": True,
                    "full_name": "Admin User",
                    "mobile_number": "0000000000",
                    "address": "Default Address",
                    "city": "Default City",
                    "state": "Default State",
                    "pincode": "000000",
                }
            )

            # Create the admin user
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                try:
                    # Set admin-specific fields
                    user = serializer.save()
                    user.is_admin = True
                    user.is_verified = True
                    user.save()

                    # Mark the code as used
                    admin_code.is_used = True
                    admin_code.used_at = timezone.now()
                    admin_code.save()

                    return Response(
                        {
                            "message": "Admin user created successfully",
                            "data": serializer.data,
                            "status": "success",
                        },
                        status=status.HTTP_201_CREATED,
                    )
                except Exception as e:
                    return Response(
                        {
                            "message": "Error creating admin user",
                            "error": str(e),
                            "status": "error",
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            return Response(
                {
                    "message": "Invalid data",
                    "errors": serializer.errors,
                    "status": "error",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {
                    "message": "An unexpected error occurred",
                    "error": str(e),
                    "status": "error",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
