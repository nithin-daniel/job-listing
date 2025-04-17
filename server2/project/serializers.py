from rest_framework import serializers
from .models import User, ServiceCategory, Job


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "full_name",
            "email",
            "user_type",
            "mobile_number",
            "address",
            "city",
            "state",
            "pincode",
            "highest_qualification",
            "experience",
            "service_category",
            "hourly_rate",
            "works",
        ]

    def validate(self, data):
        if data.get("user_type") == "worker":
            required_fields = [
                "highest_qualification",
                "experience",
                "service_category",
                "hourly_rate",
            ]
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError(
                        f"{field} is required for workers"
                    )
        return data


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ["id", "name"]


class JobSerializer(serializers.ModelSerializer):
    service_category_name = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "description",
            "user",
            "deadline",
            "created_at",
            "service_category",
            "service_category_name",
            "is_completed",
            "budget",
            "location",
            "image",
        ]
        read_only_fields = ["id", "created_at"]

    def get_service_category_name(self, obj):
        if obj.service_category:
            return obj.service_category.name
        return None
