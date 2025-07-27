from rest_framework import serializers
from .models import Task, Category, SubTask
from rest_framework.exceptions import ValidationError

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = ['id', 'title', 'is_done']

class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubTaskSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'start_datetime', 
            'end_datetime', 'image_path', 'status', 'priority',
            'created_at', 'category', 'category_id', 'subtasks'
        ]

    def validate(self, data):
        if data['start_datetime'] >= data['end_datetime']:
            raise ValidationError("La date de fin doit être postérieure à la date de début.")
        return data