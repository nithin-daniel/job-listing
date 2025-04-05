from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, Offer, Job, JobImage


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "user_type",
            "password",
            "is_worker",
            "first_name",
            "last_name",
            "email",
            "mobile_number",
            "address",
            "city",
            "state",
            "pincode",
            "highest_qualification",
            "qualification_proof",
            "experience",
            "service_category",
            "hourly_rate",
            "likes",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "id": {"read_only": True},
            "likes": {"read_only": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        # Hash the password using make_password
        hashed_password = make_password(password)
        # Create user with hashed password
        user = User.objects.create(password=hashed_password, **validated_data)
        return user


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = [
            "id",
            "worker",
            "job",
            "worker_accepted",
            "client_accepted",
            "is_completed",
            "created_at",
            "updated_at",
            "is_accepted",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "is_accepted"]

    def validate(self, data):
        # Ensure worker is actually a worker
        if "worker" in data and not data["worker"].is_worker:
            raise serializers.ValidationError("Selected user is not a worker")

        # Ensure job isn't already taken
        if self.instance is None:  # Only check on creation
            job = data.get("job")
            if (
                job
                and Offer.objects.filter(
                    job=job, worker_accepted=True, client_accepted=True
                ).exists()
            ):
                raise serializers.ValidationError(
                    "This job already has an accepted offer"
                )

        return data


class JobImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobImage
        fields = ["id", "image", "uploaded_at"]


class JobSerializer(serializers.ModelSerializer):
    images = JobImageSerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "description",
            "client",
            "created_at",
            "service_category",
            "is_completed",
            "budget",
            "location",
            "images",
        ]
        read_only_fields = ["id", "created_at"]
