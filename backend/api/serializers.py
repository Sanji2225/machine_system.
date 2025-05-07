from rest_framework import serializers
from .models import Lavanderia, Maquina, Pagamento
from datetime import datetime, timedelta

class MaquinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maquina
        fields = ["id", "lavanderia", "status", "previsao_liberacao"]

class LavanderiaSerializer(serializers.ModelSerializer):
    maquinas = MaquinaSerializer(many=True, read_only=True)

    class Meta:
        model = Lavanderia
        fields = ["id", "nome", "endereco", "status", "latitude", "longitude", "maquinas"]

class PagamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pagamento
        fields = ["id", "maquina", "aprovado", "timestamp"]

    def update(self, instance, validated_data):
        instance.aprovado = validated_data.get("aprovado", instance.aprovado)
        if instance.aprovado:
            maquina = instance.maquina
            maquina.status = "ocupado"
            # Define a previsão de liberação para 1 hora a partir de agora
            maquina.previsao_liberacao = datetime.now() + timedelta(hours=1)
            maquina.save()
        instance.save()
        return instance

class MaquinaStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maquina
        fields = ["id", "status", "previsao_liberacao"]

