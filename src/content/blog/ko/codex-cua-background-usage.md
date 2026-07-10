---
title: 'Codex 사용량이 찝찝할 때 만난 soonsoon 님의 CUA 관찰'
description: 'Codex 사용량 문제를 신경 쓰던 중 soonsoon 님의 실제 환경 관찰을 읽고, 무엇을 알 수 있고 무엇은 아직 모르는지 정리한 글입니다.'
pubDate: 'Jul 09 2026'
status: observed
source: soonsoon.io
sourceUrl: https://soonsoon.io/openai-codex-cua-background-usage-drain/
---

최근 Codex 주간 사용량이 예상보다 빠르게 줄어드는 문제를 계속 신경 쓰고 있었습니다.

프롬프트를 그렇게 많이 던진 것도 아닌 것 같은데 한도가 눈에 띄게 줄어드는 느낌.  
기분 탓인지, 집계 지연인지, Desktop 앱이나 백그라운드 작업 때문인지 선이 잘 안 잡히는 상태였습니다.

그러다 soonsoon 님의 글을 읽었습니다.

> [Codex 사용량이 줄어드는 이유? Computer Use / CUA 백그라운드 작업에서 찾은 힌트](https://soonsoon.io/openai-codex-cua-background-usage-drain/)

반가웠습니다. 그냥 “Codex 사용량이 너무 빨리 줄었다”는 체감담이 아니라,  
실제 macOS 환경에서 실행 중인 프로세스와 로컬 로그를 확인하며 가능한 원인을 좁혀 간 글이었기 때문입니다.

soonsoon 님의 글에서는 Codex Desktop과 Computer Use, 즉 CUA와 관련된 것으로 보이는 프로세스가  
사용자가 직접 프롬프트를 입력하지 않는 동안에도 계속 실행되고 있었다고 설명합니다.

대표적으로 언급된 프로세스는 다음과 같습니다.

- `SkyComputerUseService`
- `cua_node/bin/node_repl`
- `VideoCaptureService`

soonsoon 님은 이 프로세스들이 떠 있던 시기와 주간 사용량이 빠르게 줄어든 시기가  
상당 부분 겹쳐 보였다고 기록했습니다.

다만 이 점을 곧바로 원인으로 단정하지는 않았습니다.

## 여기서부터 조금 찝찝해진다

그래서 이 대목부터 더 눈이 갔습니다.

우리가 생각하는 “작업 중”과 애플리케이션 내부에서 실제로 무언가가 실행되는 시간이  
꼭 같지는 않을 수 있다는 것.

일반적으로 우리는 프롬프트를 입력하고 결과를 기다리는 시간을  
AI 도구를 사용한 시간으로 생각합니다.

하지만 Codex Desktop처럼 다음 기능을 함께 사용하는 환경에서는 이야기가 달라질 수 있습니다.

- 화면 상태 확인
- 데스크톱 애플리케이션 조작
- 브라우저 사용
- 화면 캡처
- 보조 프로세스 실행
- 작업 상태 유지
- 스레드 생성과 종료

OpenAI 공식 문서에 따르면 Computer Use는 Codex가 macOS나 Windows의 그래픽 인터페이스를  
직접 보고 조작할 수 있도록 하는 기능입니다.

macOS에서는 화면 기록과 손쉬운 사용 권한이 필요하고,  
Codex가 화면을 확인하고 클릭하거나 입력할 수 있도록 별도의 실행 환경이 사용됩니다.

따라서 Computer Use가 활성화된 상태에서는  
일반적인 CLI 작업보다 더 많은 백그라운드 구성요소가 움직이는 것 자체는 자연스럽습니다.

문제는 사용자가 작업을 끝냈다고 생각한 뒤에도  
그 활동이 계속 유지되는지, 그리고 그것이 실제 사용량 계산에 포함되는지를  
사용자 입장에서 명확히 확인하기 어렵다는 점입니다.

## 겹친다고 곧 원인은 아니다

soonsoon 님의 글에서도 가장 조심스럽게 선을 긋는 부분으로 느껴집니다.

백그라운드 프로세스가 실행된 시점과 사용량 감소가 겹쳤다는 것은  
분명 확인해 볼 가치가 있는 신호입니다.

하지만 그것만으로 다음과 같이 단정할 수는 없습니다.

> Computer Use 프로세스가 주간 사용량을 직접 소진했다.

사용량 감소에는 여러 가능성이 함께 존재할 수 있습니다.

- 사용량 집계 지연
- Codex Desktop 작업
- CLI 실행
- IDE 확장 기능
- 자동 검토
- 서브에이전트
- 재시도된 작업
- 중단되지 않은 세션
- Computer Use 백그라운드 실행

실제로 OpenAI는 Codex 사용량 한도가 예상보다 빠르게 소진되는 문제를  
공식 상태 페이지에 게시한 적도 있습니다.

- [OpenAI Status: Codex Usage Limits Depleting Faster Than Expected](https://status.openai.com/incidents/01KW2E6W0503W4NXJNCVAG8V6T)

따라서 특정 로컬 프로세스 하나를 원인으로 찍기보다는,  
제품 측 사용량 집계 문제와 로컬 실행 상태를 같이 보는 쪽이 더 맞아 보입니다.

## 그럼 나는 뭘 볼까

비슷한 현상이 있다면 저는 일단 아래를 보게 될 것 같습니다.

### 1. Codex Desktop을 완전히 종료했는가

창만 닫은 것인지, 애플리케이션 자체가 종료된 것인지 먼저 갈라 봐야 합니다.

macOS에서는 창을 닫아도 앱 프로세스가 계속 실행되는 경우가 흔합니다.

### 2. Computer Use가 켜져 있는가

Computer Use를 켰을 때와 껐을 때, 사용량 흐름이 달라지는지도 비교해 봐야죠.

### 3. 관련 프로세스가 계속 남아 있는가

Activity Monitor에서 이런 프로세스들이 아직 남아 있는지 볼 수 있습니다.

- `SkyComputerUseService`
- `node_repl`
- `VideoCaptureService`

다만 프로세스가 존재한다는 사실만으로  
사용량을 소비하고 있다고 판단해서는 안 됩니다.

### 4. 사용량 변화를 시간대별로 기록했는가

막연한 체감만 붙잡고 있는 것보다는, 아래처럼 시간대별로 기록해 두는 편이 낫더라고요.

| 시각 | Codex 상태 | Computer Use | 직접 실행 작업 | 사용량 변화 |
|---|---|---|---|---|
| 09:00 | 실행 | 켜짐 | 문서 검토 | 기준값 |
| 12:00 | 유휴 | 켜짐 | 없음 | 변화 확인 |
| 15:00 | 종료 | 꺼짐 | 없음 | 변화 확인 |

이렇게 하면 단순한 인상과 실제 변화를 구분하기가 조금 쉬워집니다.

## 제가 얻은 결론

soonsoon 님의 글은 Computer Use가 사용량 소진의 원인이라고 증명한 글은 아닙니다.

오히려 더 중요한 메시지는 다음이라고 생각합니다.

> AI 도구의 사용량을 이해하려면 프롬프트 수만 볼 것이 아니라  
> 애플리케이션, 백그라운드 세션, 자동 작업과 보조 프로세스까지 함께 봐야 한다.

Codex처럼 CLI, Desktop, IDE, Computer Use, 자동 검토와 서브에이전트가  
하나의 사용량 체계 안에서 함께 움직이는 환경에서는  
사용자가 어느 기능에서 얼마나 사용했는지 구분하기 어렵습니다.

따라서 이런 실증적 관찰 기록은 공식적인 원인 분석을 대신할 수는 없지만,  
저처럼 같은 문제를 찝찝하게 보고 있던 사람에게는 꽤 실용적인 출발점이 됩니다.

저 역시 앞으로 Codex 사용량이 예상과 다르게 움직일 때는  
단순히 프롬프트를 많이 사용했는지만 보지 않고  
Desktop 앱, Computer Use 설정, 백그라운드 프로세스와 실행 기록을 함께 확인해 볼 생각입니다.

---

원문:

- [Codex 사용량이 줄어드는 이유? Computer Use / CUA 백그라운드 작업에서 찾은 힌트](https://soonsoon.io/openai-codex-cua-background-usage-drain/)

참고:

- [OpenAI Codex Computer Use 공식 문서](https://developers.openai.com/codex/app/computer-use)
