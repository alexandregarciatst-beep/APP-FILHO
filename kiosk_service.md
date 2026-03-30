# Guia de Configuração: Modo Kiosk (Camada de Responsabilidade)

Para que o **TaskHero Ultra** funcione como uma verdadeira camada de bloqueio no Android/iOS, siga as instruções abaixo:

## 1. Android (Fixação de Tela)
O Android possui um recurso nativo chamado "Fixação de Tela" (Screen Pinning).

1. Vá em **Configurações** > **Segurança** > **Fixação de Tela** (ou App Pinning) e ative.
2. Abra o TaskHero Ultra.
3. Abra a tela de apps recentes, clique no ícone do app e selecione **Fixar**.
4. O app agora está "preso". Para sair, é necessário pressionar os botões "Voltar" e "Recentes" simultaneamente (e inserir a senha se configurado).

## 2. iOS (Acesso Guiado)
No iPhone/iPad, use o "Acesso Guiado".

1. Vá em **Ajustes** > **Acessibilidade** > **Acesso Guiado** e ative.
2. Configure uma senha.
3. No TaskHero Ultra, clique três vezes no botão lateral (ou Início).
4. Clique em **Iniciar**. O celular agora só permite o uso deste app.

## 3. Integração Técnica (Flutter/Native)
Se você estiver compilando para Android nativo, pode usar o pacote `kiosk_mode` no Flutter:

```dart
import 'package:kiosk_mode/kiosk_mode.dart';

// Para ativar o modo kiosk (bloqueio total)
void lockApp() async {
  final res = await startKioskMode();
  print("Kiosk Mode: $res");
}

// Para desativar (Gatilho: Todas as tarefas concluídas)
void unlockApp() async {
  final res = await stopKioskMode();
  print("Kiosk Mode desativado: $res");
}
```

No nosso app Web (Next.js), o botão **"CELULAR LIBERADO"** atua como o gatilho visual. Em um ambiente de "Web App Instalado" (PWA), ele sinaliza ao usuário que o tempo de dever acabou e o lazer pode começar!
