from rest_framework import serializers
from .models import User, ServiceCategory


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
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
