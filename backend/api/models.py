from django.db import models

class Lavanderia(models.Model):
    nome = models.CharField(max_length=100)
    endereco = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=[('aberta', 'Aberta'), ('fechada', 'Fechada')]) # Aberta ou Fechada
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.nome

class Maquina(models.Model):
    lavanderia = models.ForeignKey(Lavanderia, related_name='maquinas', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, default='livre', choices=[('livre', 'Livre'), ('ocupado', 'Ocupado')]) # Livre ou Ocupado
    previsao_liberacao = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Máquina {self.id} - {self.lavanderia.nome}"

class Pagamento(models.Model):
    maquina = models.ForeignKey(Maquina, related_name='pagamentos', on_delete=models.CASCADE)
    aprovado = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pagamento para Máquina {self.maquina.id} - {'Aprovado' if self.aprovado else 'Pendente'}"

