
프로세스 경계를 넘는 호출을 다루며 정리한 개념 노트 모음이다. 출발점은 하나다 — **네트워크 호출은 느린 함수 호출이 아니라, 결과를 모르는 상태로도 끝나는 호출**이다. 이 불확실성이 timeout, retry, 중복 실행, 부분 실패, Client·Server 상태 불일치를 한 줄기 연쇄로 만들고, 실무 패턴 대부분은 그 연쇄의 특정 고리를 끊으려는 장치다.

지금은 그 연쇄 전체를 한 노트에서 훑는다. 먼저 [Client–Server 네트워크 경계의 실패 연쇄와 위험별 대응 정리](/study-note/distributed-systems/client-server-network-boundary/)를 읽고, 8가지 위험 중 지금 마주한 것부터 "먼저 물어볼 질문" 표에서 찾아 내려가면 된다. 경계의 세부(deadline·retry·멱등 키)를 어느 계층에 둘지는 [software-architecture](/study-note/software-architecture/) 쪽 노트와 이어진다. 아래 목차 참고.
