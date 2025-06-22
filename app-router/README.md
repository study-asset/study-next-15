## App Router

Pages router 와는 다르게 app 폴더 하위로 존재하는 폴더명들을 각 페이지로 취급한다.  
그리고 각 폴더에 page.tsx 파일을 생성하면 페이지로서 동작 준비가 완료된다.

## App Router의 Catch all segment

Pages Router와 동일하게 [...id].tsx or [...id] > page.tsx 로 작성하여 사용할 수 있다.

하지만 상위 폴더에 page.tsx 가 없다면 404가 발생하게 되는데,,  
이 경우에는 대괄호를 두개 붙여 Optional Catch All Segment 로 [[...id]] > page.tsx 를 작성하면 대응이 가능하다.

결과로는 예를 들어 book id만 가져오고 book 페이지에는 page.tsx를 할당하지 않았을 경우,  
Optional Catch All Segement 로 작성하면 id가 없든 있든 다음 id 페이지로 안내해주고 모든 구간의 id의 가져올 수 있다.

```
http://localhost:3000/book [0]
or
http://localhost:3000/book/1/2/3 [1]

// Optional Catch All Segment
// Result [0] : id []
// Result [1] : id [1, 2, 3]
```

## App Router의 Layout 시스템

Layout은 기존 페이지를 덮는 하나의 레이어 시스템이다.  
Layout을 설정하고자 하는 페이지에 layout.tsx 를 생성하게 되면, children 하위 노드를 가져올 수 있고,  
Layout을 설정하면 모든 하위 페이지는 해당 Layout Element 들이 적용된다.

즉, Search > layout.tsx 를 설정할 경우 하위 모든 페이지는 layout.tsx가 적용된다.  
또한, 상위에만 layout.tsx 적용이 되는 게 아니라, 모든 페이지에 적용이 가능하고 중첩 적용된다.

```
---------------------------------
| layout.tsx                    |
|   -------------------------   |
|   |                       |   |
|   | page.tsx              |   |
|   |                       |   |
|   -------------------------   |
|                               |
---------------------------------
```

## App Router 내 소괄호를 적용한 폴더 ( Route Group )

(with-searchbar) 와 같이 소괄호를 입력할 경우, 경로 상에 영향을 미치지 않는다.  
이러한 것을 Route Group이라고 부른다.

즉, 각기 다른 경로를 갖는 페이지들을 소괄호를 포함한 경로에 넣어주면 그룹으로 묶어줄 수 있다.  
그러면 layout과 같은 파일을 해당 폴더에 담아주면 그룹으로 묶인 페이지만 별개의 디자인을 입힐 수 있다.

예를 들어, (with-searchbar) > page.tsx / (with-searchbar) > search > layou.tsx, page.tsx 처럼  
그룹으로 묶어 layout을 관리하거나 별개의 처리를 할 수 있게 된다.

## React Server Component

브라우저에서는 실행이 불가능하고 서버 측에서만 실행이 가능한 컴포넌트이다.  
이 서버 컴포넌트는 React V18 버전부터 등장했다.

### Server Component 등장 배경

서버에서 렌더링을 진행하여 브라우저 측에 보내 HTML을 렌더링했다.

그 과정에서 번들을 내려주는데 상호작용이 없는 JS 번들 파일까지 내려주면서 .. ( Hydration을 위한 )
FCP 이후에 TTI까지 걸리는 시간이 지연되는 문제점이 발생했다.

따라서, 서버에서만 실행하는 컴포넌트로서 브라우저 측에서 실행이 필요 없게 처리하여 TTI 문제를 개선했다.

### 권장사항

보통은 페이지의 대부분을 서버 컴포넌트로 구성할 것을 권장하고,  
클라이언트 컴포넌트는 꼭 필요한 경우에만 구성할 필요가 있다.

결과적으로 클라이언트 컴포넌트로서 서버에서 보내주어야할 번들이 줄어들기에  
브라우저에서의 TTI 속도를 개선해 줄 수 있다.

### 주의사항

1. 서버 컴포넌트에는 브라우저에서 실행될 코드가 포함되면 안된다.

```
// src/app/page.tsx

export default function Home() {
    const [state, setState] = useState(""); // 사용 불가

    return <div>Main Page</div>
}
```

2. 클라이언트 컴포넌트는 클라이언트에서만 실행되지 않는다.

   - 사전 렌더링 ( pre-rendering) 을 위해 서버에서 1번 실행
   - 하이드레이션을 위해 브라우저에서 1번 실행
   - 즉, 서버와 클라이언트에서 모두 실행이 되어 총 2번 실행된다.

3. 클라이언트 컴포넌트에서는 서버 컴포넌트를 import 할 수 없다.

   - 둘 다 서버에서 한번 실행되지만, 서버 컴포넌트의 경우 서버에서만 실행되어야 하기에 불가능
   - Hydration 하는 경우, 서버 컴포넌트는 서버로부터 내려주지 않기에 존재하지 않는 코드로 인식되어 에러 발생

4. 서버 컴포넌트에서 클라이언트 컴포넌트에게 직렬화 되지 않는 Props는 전달 불가하다.

   - 직렬화 ( serialization ) 객체, 배열, 클래스 등의 복잡한 구조의 데이터를 단순한 형태로 변환하는 것
   - 직렬화 예 : {"name":"지우","age":25}
   - 함수는 직렬화가 불가능 함

```
export default function ServerComponent() {
   function func() {
      console.log("험수 직렬화 x");
   };

   return <ClientComponent func={func} /> // Runtime error
}
```

## 사전 렌더링 과정

1. 서버 컴포넌트, 클라이언트 컴포넌트 상관하지 않고 서버에서 전부 실행
2. RSC Payload 진행 ( 먼저 서버 컴포넌트들만 따로 실행을 진행 )

   - React Server Component의 순수한 데이터 ( 결과물 )
   - React Server Component를 직렬화 한 결과
   - 알아보기 힘든 복잡한 구조를 띔
   - 포함 데이터
     - 서버 컴포넌트 렌더링 결과
     - 연결된 클라이언트 컴포넌트의 위치
     - 클라이언트 컴포넌트에게 전달하는 Props 값

3. 완성된 HTML 페이지 생성 후, 브라우저 전달

따라서 서버 컴포넌트에서 클라이언트 컴포넌트로 직렬화가 불가능한 함수를 전달 할 경우,  
Runtime error가 발생하게 된다.

즉, 전달이 필요한 경우 함수를 제외하고 직렬화가 가능한 오브젝트를 전달하거나  
혹은 브라우저에서만 실행될 코드가 담기지 않은 서버 컴포넌트를 전달하면 문제 없음.

children node를 통해 전달하여 결과 값만을 전달하는 방식을 권장.

### Client Component에 Server Component를 사용해야하는 경우 ..

클라이언트 컴포넌트에 children으로 서버 컴포넌트를 넘겨주는 구조로 설정하면 된다.  
그러면 클라이언트로 변경하여 오류가 발생하는 경우가 없고 직접 실행할 필요 없이 결과물만 렌더링하게 된다.

## Client Component 적용하기

서버 컴포넌트의 경우, 서버에서 단 1회만 실행되기 때문에,  
useEffect와 같은 훅을 사용할 수 없다. 즉, 브라우저에서만 실행이 되는 코드는 불가능하다는 것 ..

사용을 위해서는 컴포넌트 코드 상단에 "use client"를 입력하여 클라이언트 컴포넌트로 설정해야 한다.

## 페이지 이동은 Client Side Rendering 방식으로 처리된다.

Page Router 버전과 동일하게 CSR 방식으로 렌더링 처리가 된다.

하지만, 서버 컴포넌트가 추가되어 조금은 다른 방식으로 진행된다.

JS Bundle과 RSC Payload를 전달하게 된다는 점이다.

번들에는 상호 작용이 필요한 클라이언트 컴포넌트를 보내고, 서버 컴포넌트를 RSC Payload 과정을 거쳐  
데이터를 전달하게 된다. 즉, 서버 컴포넌트는 사전 렌더링을 위해 RSC Payload로 필요한 정보를 보내게 된다.

그리고 서버 컴포넌트가 클라이언트 컴포넌트를 포함한 경우,  
해당 페이지로 이동하여 관리자 도구에 Network 탭에서 받은 데이터들을 보면 RSC의 서버 컴포넌트와 ..  
번들 파일을 지닌 Client Component를 전달받는 모습을 확인 해 볼 수 있다.

## App Router 에서의 pre-fetching ( 사전 렌더링 ) 동작

서버 컴포넌트가 추가됨으로서 RSC Payload로 직렬화된 데이터와 클라이언트 컴포넌트로 이루어지는 번들 파일을  
다운로드하는 모습을 볼 수 있다.

동적인 경로인 페이지의 경우, 브라우저가 요청할 때마다 생성될 동적인 페이지라서 RSC 정보로 전달하게 된다.

빌드 시, 빌드 타임에 생성하면 안될 내용들이 담긴 컴포넌트는 다이나믹한 페이지로 설정이 되어 SSR 방식처럼  
처리가 되고, 그 외 정적인 화면인 페이지들은 기본 값인 SSG 방식으로 빌드된다.

## App Router 에서의 데이터 페칭

App Router에서는 서버 컴포넌트로 인해 데이터 페칭에도 영향이 있었다.

기존에는 getServerSideProps와 같은 방법으로 페칭하여 다음 페이지로 정보를 전달했는데,  
이것은 서버 컴포넌트라는 개념이 존재하지 않았기에 이러한 형태로 작성해야 했다.

이제는 Page 함수 안에서 자체적으로 페칭이 가능하기에  
getServerSideProps와 같은 함수로 먼저 페칭하고 props로 넘겨줄 필요가 없어졌다.

```
export default function ServerComponent() {
   const data = fetch("...");
   const response = data.json();

   return <div></div>
}
```

클라이언트 컴포넌트에서는 Async 키워드를 지원하지 않았는데,  
브라우저에서 동작할 경우, 메모이제이션 차원에서 문제를 일으킬 가능성이 있었다.

이제는 비동기적으로 컴포넌트에서 직접 fetch 메서드를 활용할 수 있게 되었다.  
즉, getServerSideProps, getStaicProps를 사용할 필요가 없어진 것.

## 데이터 캐시 ( Data Cache )

fetch 메서드를 활용해 불러온 데이터를 Next 서버에서 보관하는 기능  
영구적으로 데이터를 보관하거나, 특정 시간을 주기로 갱신 시키는 것이 가능

결론적으로 불 필요한 데이터의 요청의 수를 줄여 웹 서비스의 성능을 개선할 수 있다.

```
const response = await fetch("~/api", { cache: "force-cache" });

// 옵션 값 : cache: "force-cache", cache: "no-store", next: { revalidate: 10 }, next: { tags: ['a'] }
```

다양한 추가적인 옵션으로 캐시 설정을 할 수 있다.  
하지만, axios와 같은 외부 라이브러리로는 사용이 불가능하고 Next에서 자체적으로 지원하기에 fetch를 활용해야 한다.

각 캐시 정보를 확인하는 방법은 next.config.js의 logging: { fetches: { fullUrl: true } } 로 설정 할 경우 확인 할 수 있다.  
캐시된 정보는 (cache hit) 혹은 (cache skip) 으로 표현된다.

그리고 기본적으로 "no-store" 값으로 적용되니 참고할 것.

### { cache: "no-store" }

캐시 정보를 저장하지 않는다는 의미의 옵션이다.  
매번 새로운 정보를 백엔드로 요청을 보내게 된다. 재활용할 데이터가 없기에 매번 갱신이 되게 된다.

### { cache: "force-cache" }

캐시 정보를 처음에는 존재하지 않기에 MISS가 발생하고, 데이터 요청 후 SET 작업을 통해 캐시에 저장한다.  
이후로 동일한 서버 URL로 요청 시, 데이터 캐시에서 찾아 HIT을 발생시키고 기존 캐시 데이터를 불러오게 된다.

### next: { revalidate: 10 }

10초 후 기존 캐시 데이터는 STALE 상태로 변화시키고 일단 그 데이터를 전달한다.  
이후 다시 SET 작업을 통해 캐시에 저장하고 다음부터는 HIT으로 새로 저장된 캐시 데이터를 전달하게 된다.

### next: { tags: ['a'] }

On-Demand Revalidate ISR와 같은 방식으로 실행된다.  
요청이 들어왔을 때 데이터를 최신화하게 된다.

예를 들어, 기존 On-Demand Revalidate의 경우 요청이 들어오면 지정된 링크의 HTML 파일을 재생성하게 되어  
최신화를 진행한다.

이것처럼 tags를 설정해 두면 해당 tags의 값으로 API 요청이 들어오면 해당 tags 를 가진 API 정보를 캐시 데이터에  
새로운 데이터를 넣어주어 업데이트해 주는 방식인 것이다.

## Request Memoization

뜻은 "요청을 기억한다" 라는 의미인데, 중복적으로 발생하는 요청들을 캐싱해서 딱 한번만 전달하도록 데이터 페칭을 최적화 해 주는 기능이다.

예를 들어, fetch(`~/api/A`) 로 서버로 데이터 요청을 보냈을 경우, 처음엔 백엔드 서버로 요청을 보낸다.  
이후, 데이터를 받아오는 과정에 리퀘스트 메모이제이션 영역에 SET 처리를 진행하여 기억을 해 두고,  
동일한 API로 요청을 왔을 경우, 서버까지 가지 않고 리퀘스트 메모이제이션 영역에서 HIT 처리가 되어 데이터를 재활용하여 렌더링한다.

하지만 이건 기존 데이터 캐시와는 엄연히 다르다.  
중복된 API 요청을 캐싱하기 위해 존재하기 때문에 렌더링이 완료되면 모든 리퀘스트 메모이제이션의 캐시는 삭제된다.

즉, 서버가 가동 중에는 데이터 캐시에는 캐시된 데이터가 영구적으로 저장되지만,
리퀘스트 메모이제이션 캐시 영역에 저장된 캐시는 API 요청 후 렌더링이 완료되면 데이터는 모두 삭제된다.

## 풀 라우트 캐시 ( Full Route Cache )

Next 서버 측에서 빌드 타임에 특정 페이지의 렌더링 결과를 캐싱하는 기능

프로젝트가 빌드될 때 A라는 주소를 가진 페이지가 Full Route 캐시에 저장되는 페이지로서 설정이라면  
빌드 타임에 미리 렌더링을 진행하고 페이지에 필요한 데이터를 가져와 처리한다.

그리고 그 결과를 풀 라우트 캐시에 저장하여 SET 처리가 되어 생성 결과를 기억한다.

이후, A에 접속 요청이 온다면 풀 라우트 캐시로부터 HIT되어 그대로 HTML이 전송된다.

정적인 화면을 미리 만들어 전달하는 것과 같은 효과를 발휘한다.

## Static과 Dynamic 페이지 구별법

Dynamic의 경우 데이터 매번 변경되어 처리되는 페이지를 말한다.

따라서, 동적 함수를 사용하여 데이터 변화하거나 매번 다른 데이터를 받는 페이지는 자동으로 동적 페이지로 설정된다.

- 캐시되지 않는 Data Fetching이 이루어질 경우
- 동적함수 ( 쿠키, 헤더, 쿼리스트링 ) 을 사용하는 컴포넌트가 존재할 경우

Static의 경우, 변화가 없는 페이지로서 동적으로 데이터가 변화하지 않는 페이지를 말한다.

| 동적 함수 | 데이터 캐시 | 페이지 분류  |
| --------- | ----------- | ------------ |
| Yes       | No          | Dynamic Page |
| Yes       | Yes         | Dynamic Page |
| No        | No          | Dynamic Page |
| No        | Yes         | Static Page  |

4번째 페이지의 경우 Static이기에 빌드 타임에 미리 페이지를 렌더링하고 캐싱한다.  
이후, 접속할 경우 미리 만들어 둔 HTML을 풀 라우트 캐시에서 가져온다.

## 풀 라우트 캐시 Revalidate

A라는 Static 페이지가 빌드 타임에 생성될 때 3초마다 갱신이 되어야 하는 데이터 페칭이 존재할 경우,
데이터 캐시에 저장되는 데이터 뿐만 아니라 풀 라우트 캐시에 저장되는 데이터 또한 revalidate 주기마다 갱신되게 된다.

## 풀 라우트 캐시 동적 경로 적용

동적 경로의 경우 매번 변화되는 데이터에 대한 요청을 처리해야 하는데,  
이 경우, API의 캐시 옵션을 force-cache로 설정한다면 새로운 데이터는 요청을 보내지만,  
이미 한번 요청을 보냈던 데이터에 대해선 저장을 해두기에 빠르게 전달이 가능하다.

만약 매번 달라지는 id를 파라미터를 받아와야하는 페이지일 경우 ..  
직접 어떤 id가 올 수 있는지 알려주어야 한다.

빌드 타임에 미리 만들 수 있도록 알려주는 방법은 Next에서 약속된 generateStaticParams 함수를 활용하는 것.  
이 함수를 작성하는 경우 페이지 맨 위 상단에 위치하고 export를 통해 내보내주어야 한다.

코드로 예시를 들자면

```
export function generateStaticParams() {
   return [{ id: "1" }, { id: "2" }, { id: "3" }];
};

export default function Page({ params }: { params: Promise<{ id: string | string[] }> }) {
   return <div></div>
}
```

위 코드처럼 미리 1, 2, 3번 아이디에 대한 값을 알려주고,  
빌드 타임에 1, 2, 3번에 대한 정보가 담긴 HTML 파일을 만들 수 있도록 한다.

1, 2, 3번을 제외한 나머지 값은 요청이 들어올 때 새로 요청해야 하겠지만,  
1, 2, 3번은 미리 만들어 두었기 때문에 요청이 들어오면 미리 만들어 둔 파일을 전달해 줌으로서 빠르게 처리할 수 있다.

```
// 빌드 결과

├ ● /book/[id]                             295 B         101 kB
├   ├ /book/1
├   ├ /book/2
├   └ /book/3
```

## App Router - Not Found 페이지 만들기

App Router에서 Not Found를 만드는 방법은 root 디렉토리에 not-found.tsx 파일을 만들고,  
실제 Not Found를 띄울 로직 위에서 notFound() 메서드를 실행한다면 Not Found 화면으로 리다이렉트한다.

## generateStaticParams 에 작성한 데이터를 제외한 나머지 띄우지 않기

상단에 dynamicParams를 작성해 주면 된다

```
export const dynamicParams = false;
```

## Route Segment Option

강제로 특정 페이지를 Static 혹은 dynamic으로 설정하거나,  
페이지에 revalidate 타임을 강제로 설정하는 것.

Route Segment Option 종류  
https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config

1. dynamic : 특정 페이지의 유형을 강제로 static 혹은 dynamic 페이지로 설정
   - auto : 기본값, 아무것도 강제하지 않음 ( 기본 값 )
   - force-dynamic : 페이지를 강제로 dynamic 페이지로 설정
   - force-static : 페이지를 강제로 static 페이지로 설정
   - error : 페이지를 강제로 static 페이로 설정 ( 사용하면 안되는 이유가 있다면 빌드 오류 )

## 클라이언트 라우터 캐시

이 캐시의 경우엔 미리 만들어 둔 렌더링 결과물을 전달하는 풀 라우트 캐시와는 다르게  
중복되는 레이아웃과 같은 RSC Payload 결과물들을 저장하는 것이다. ( 자동으로 처리됨 )

Searchbar 레이아웃을 똑같이 사용 중인 두 개의 페이지는 미리 브라우저 측에 저장된 캐시를 사용하는 것이다.

즉, 브라우저에 저장되는 캐시이며 페이지 이동을 효율적으로 진행하기 위해 페이지의 일부 데이터를 저장하는 것.

하지만, 브라우저가 새로고침이 된다면 캐시된 내용은 제거된다.

## 페이지 스트리밍

서버에서 데이터를 보내주어야할 때 데이터가 큰 경우, 여러개로 나눠 보내는 방식

마치 스트리밍과 같은 기능을 하는 내용

이것을 Next 프로젝트에 적용하게 되면 바로 보여줄 수 있는 내용을 즉시 렌더링하고,  
나머지 비동기적인 데이터들은 로딩과 같은 대체 UI를 보여주다가 완료되면 후속으로 보여주는 방식으로 사용 가능

즉, 오래 걸리는 컴포넌트의 렌더링을 두고 사용자가 먼저 볼 수 있는 UI를 보여주어
더 나은 환경을 제공하기 위한 방법

## Loading file-system

page.tsx, layout.tsx 동일하게 loading.tsx 도 만들어 로딩 화면을 처리할 수 있다.

이 경우, loading.tsx 파일은 async 비동기 page 컴포넌트에서 사용할 수 있고 별도의 컴포넌트에 적용하려면,  
Suspense를 활용하여 처리할 수 있다.

## Suspense 활용하기

Suspense는 첫 렌더링에 딜레이가 발생할 경우, fallback 을 띄우지만  
첫 번째 이후로는 다시 표기되지 않는다.

이런 경우, 해결하는 방법은 key를 지정하여 자주 변경될 수 있는 값을 넣어 처리하면  
다음에 값이 변경된 경우, 다시 한번 Suspense의 fallback을 활성화 할 수 있다.

또한, 여러개 컴포넌트에 대해 각 Suspense를 적용하여 먼저 완료된 컴포넌트부터 띄우며,  
로딩이 완료되지 않은 컴포넌트는 fallback 화면을 띄울 수 있다.

## Suspense와 스켈레톤 UI 적용하기

스켈레톤 UI는 뼈대 역할을 하는 UI이며, 로딩되지 않은 컨텐츠 대신 실루엣을 미리 보여주는 것을 말한다.  
"대충 이런 UI가 나타날 예정이구나" 라는 느낌으로 사용자에게 전달할 수 있다.

## Error file-system

fetch 를 실행하던 도중 서버에 문제가 발생하거나, 코드 측에서 URL이 잘못된 경우에 에러 핸들링이 가능하다.  
그게 Next에서 제공하는 파일 시스템 중 하나인 Error 컴포넌트를 사용하는 것이다.

하지만, 이 에러 컴포넌트를 사용하기 위해서 서버에서나 클라이언트에서나 에러가 발생한 모든 상황에 대해  
대응이 가능하도록 클라이언트 컴포넌트로서 동작하도록 설정해 줄 필요가 있다.

```
{any-folders}/error.tsx

"use client"

export default function Error() {
   return <div>에러가 발생하였습니다.</div>
}
```

여기서 Error 컴포넌트는 error와 reset 매개변수를 제공하는데,  
error는 Error의 타입으로 reset은 매개변수와 반환하는 값이 없는 동작을 하는 함수이다.

이렇게 각 값에 대한 error 핸들링과 reset을 통해 다시 요청을 시도 할 수 있다.  
하지만 reset은 서버 컴포넌트를 다시 실행해 보는 것이 아닌 렌더링만 다시 시도하는 것이기에 주의해야 한다.

## startTransition 활용하여 router.refresh 사용하기

```
"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

export default async function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.log(error.message);
  }, [error]);

  return (
    <div>
      <h3>오류가 발생했습니다</h3>
      <button
        onClick={() => {
          startTransition(() => {
            router.refresh();
            reset();
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}

```

router의 refresh는 반환하는 값이 없는 비동기적 함수이다.  
이 경우, 아직 데이터 로드를 못한 상태에서 reset() 함수가 동작하는데, 그대로 오류가 나올 수 있다.

해결 방법은 startTransition을 통해 하나의 콜백 함수 안에 있는 동작을 일괄적으로 처리하여 해결할 수 있다.

## Error 컴포넌트 덮어씌우기

Error 컴포넌트가 상위와 하위에 존재할 경우, 하위는 상위 Error 컴포넌트를 덮어씌워 사용하게 된다.

## 서버 액션

브라우저에서 호출할 수 있는 서버에서 실행되는 비동기 함수이다.

```
export default function Page() {
   const saveName = async (formData: FormData) => {
      "use server"

      const name = formData.get("name");
      // sql 쿼리문 실행 혹은 DB에 직접 입력 가능
   };

   return (
      <form action={saveName}>
         <input name="name" placeHolder="이름을 입력해 주세요." />
         <button type="submit">제출</button>
      </from>
   )
}
```

action props인 saveName을 실행할 경우, "use server" 를 통해 Next 서버에서 실행되는 서버 액션을 사용할 수 있다.  
따라서, 서버에서 실행되는 코드로 서버에서만 처리가 가능한 DB 액션 혹은 SQL 쿼리문 실행이 가능해진다.

## revalidate 재검즘

Next에서 제공하는 next/cache의 revalidatePath 를 사용하여 링크를 입력하면 해당 페이지의 상태를 재검증하고,  
새롭게 해당 페이지를 렌더링한다.

```
revalidatePath(`/book/${bookId}`);
```

주의사항으로는 서버 측에서만 호출이 가능하기에 서버 액션 내부 혹은 서버 컴포넌트 내부에서만 호출 할 수 있다.  
또한, revalidatePath는 입력한 주소의 모든 렌더링 정보를 초기화하는 점이 있다.

그리고 풀 라우트 캐시에 저장되지도 않기에 정적 페이지가 업데이트 되지는 않는다.  
다만, 다음 접속 시에는 Dynamic 페이지처럼 업데이트 된다.

## revalidatePath의 옵션

1. page

   - 특정 경로의 모든 동적 페이지를 재검증
   - 주소 입력 시, 해당 페이지 컴포넌트가 작성된 파일의 경로를 명시해 주어야 함.
   - EX ) "/book/[id]"

2. layout

   - 특정 레이아웃이 갖는 모든 페이지 재검증
   - 라우트 그룹의 이름까지 작성하여 명시해 준다.
   - EX ) "/(with-searchbar)"

3. layout

   - 모든 데이터 재검증도 가능
   - EX ) "/"

## revalidateTag("tag") 재검증

태그 기준, 데이터 캐시 재검증을 진행할 수 있다.

fetch의 옵션 중에 next : { tags: [""] } 옵션을 활용해서 해당 페이지에 대한 정보를 담은 태그를 작성하고,  
revalidateTag() 메서드 안에 해당 태그를 입력하여 재검증을 요청할 수 있다.

```
// 태그 입력
const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`, {
   next: { tags: [`review-${bookId}`] },
});

// 태그 재검증
revalidateTag(`review-${bookId}`);

```

## 클라이언트 컴포넌트에서의 서버 액션

useActionState 훅을 사용하여 form action에 사용했던 함수를 첫번째 인자로 담아주고,  
두번째 인자로는 초기 값을 작성해 준다.

그런 후, 해당 훅은 3가지 값 state, formAction, isPending 과 같은 값을 반환한다.

formAction을 form에 담아주고 formAction이 실행되면 state 값과 isPending 이라는 값으로 상태를 관리할 수 있다.

```
export default function ReviewEditor({ bookId }: { bookId: string }) {
  const [state, formAction, isPending] = useActionState(createReviewAction, null);

  return (
    <section>
      <form className={styles.form_container} action={formAction}>
        <input name="bookId" value={bookId} hidden readOnly />
        <textarea name="content" placeholder="리뷰 내용" required />
        <div className={styles.submit_container}>
          <input name="author" placeholder="작성자" required />
          <button type="submit">작성하기</button>
        </div>
      </form>
    </section>
  );
}
```

state는 해당 formAction에 사용된 함수에서 반환된 데이터를 확인할 수 있다.

예를 들어, formAction에서 오류가 발생하여 { status: false, error: "리뷰 내용을 입력햊 주세요." } 라는  
메세지를 반환한 경우 state 값으로 확인할 수 있다는 것이다.

그리고 isPending은 보이는 의미대로 현재 진행상태를 알려주는 것이다.

따라서 해당 액션 함수에서 status 값과 error 메세지를 반환하면 state 값으로 확인이 가능하고,  
해당 값으로 사용자에게 어떤 문제가 발생하였는 지 혹은 개발 중에 에러 메세지를 편리하게 확인해 볼 수 있는 기능을 만들 수 있다.

## Parallel Route ( 병렬 라우트 )

하나의 화면 안에 여러 개의 페이지를 병렬로 렌더링해 주는 패턴이다.  
여기서 페이지란 흔히 말하는 컴포넌트가 아닌 page.tsx 로 쓰이는 화면을 병렬로 렌더링해 주는 기술이라고 보면 된다.  
보통 이런 것은 복잡한 내용의 구조를 가진 사이트에서 유용하게 사용될 수 있다.

parallel 환경을 구축하기 위해서는 먼저 하나의 페이지를 작성해 주어야 한다. 예시 참고

1. src > app > parallel
2. src > app > parallel > page.tsx
3. src > app > parallel > layout.tsx
4. Parallel을 적용한 Slot을 만들어 준다.
   - Slot : @ 기호가 붙고 병렬로 렌더링될 페이지 컴포넌트를 보관하는 폴더이다.
   - 이렇게 만들어진 Slot은 상위 폴더에 layout.tsx props로 전달이 된다. ( props 명은 앞서 작성한 이름으로 )

주의 : Next의 버그로 보이지 않을 수 있으니, .next 파일을 제거하고 다시 개발 모드로 실행하면 정상적으로 보임.

그리고 Slot은 추가적으로 제공될 페이지를 보관하는 폴더로서 주소로 직접 들어가도 화면이 보이지는 않으며, 얼마든지 만들어도 된다.

## Intercepting Route

사용자가 특정 경로로 접속해서 새로운 페이지를 요청할 때 그 요청을 가로채서 원하는 페이지를 렌더링하는 것을 말한다.  
즉, 동일한 경로로 접속하여도 특정 조건을 만족하면 다른 페이지를 보여주는 것이다.

여기서 접속은 초기 접속이 아닌 경우, 인터셉팅 라우터가 동작하게 된다.

예를 들어, 인스타그램에서 게시글을 클릭하면 모달 팝업 형태로 나와 쉽게 뒤로가기가 가능하지만,  
해당 상태에서 새로고침을 하게 되면 원래 게시글 리스트 페이지가 아닌 모달 팝업에 있던 내용이 담긴 게시글 페이지로 이동하게 되는 것으로 설명할 수 있다.
