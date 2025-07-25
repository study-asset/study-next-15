## Page Router

pages 파일 아래 디렉토리 이름 혹은 파일 이름을 기준으로 페이지를 구성한다.

## 각 Page 생성 방법

Pages 아래 디렉토리 혹은 파일을 원하는 페이지 이름으로 작성하여 생성한다.

구조 : pages > home.tsx
접속 : http://localhost:3000/home

## URL Query 받아오기

1. 페이지를 생성하던 것처럼 생성 후, URL에 http://localhost:3000/book?q=1 과 같은 형태로 작성한다.
2. 해당 페이지를 담당하는 코드 파일에 next/router 의 useRouter 훅을 import 한다.
3. import된 useRouter를 페이지 함수 내부에 선언하고 query를 입력 받는다.
4. query 오브젝트 안에 q 키를 꺼내 사용한다. ( 아래 예시 참고 )

```
// Directory : src/pages/search/index.tsx
// URL : http://localhost:3000/search?q=1

import { useRouter } from "next/router";

export default function Page() {
    const router = useRouter();
    const { q } = router.query;

    // console.log(router.query); { q: '1' }

    return <h1>Search id : {q}</h1>
}
```

## URL Parameter 받아오기

1. 페이지를 생성할 때, 대괄호와 함께 디렉토리 혹은 파일을 생성한다. EX ) [id].tsx
2. Query를 받아오는 것과 동일하게 useRouter를 import 하여 함수 내부에 선언한다.

```
// Directory : src/pages/book/[id].tsx
// URL : http://localhost:3000/book/1

import { useRouter } from "next/router";

export default function Page() {
    const router = useRouter();
    const { id } = router.query;

    return <h1>Book id : {id}</h1>
}
```

## URL Parameter의 seg 들을 모두 받아오기

1. 페이지를 생성할 때, 대괄호와 함께 '...' 을 활용하여 id 파일을 생성한다. EX ) [...id].tsx
2. Query를 받아오는 것과 동일하게 useRouter를 import하여 함수 내부에 선언한다.

```
// Directory : src/pages/book/[...id].tsx
// URL : http://localhost:3000/book/1/2/3/4/5

import { useRouter } from "next/router";

export default function Page() {
    const router = useRouter();
    const { id: ids } = router.query as { id: string[] };

    // console.log(ids) ['1', '2', '3', '4', '5']

    return <h1>Book ids : {ids.join(",")}</h1>
}
```

## Optional Catch All Segment Page 생성

1. 페이지를 생성할 때, 대괄호를 2개를 붙여 원하는 키를 감싸 생성한다. EX ) [[id]].tsx or [[...id]].tsx

```
Directory : src/pages/book/[[id]].tsx
URL : http://localhost:3000/book

import { useRouter } from "next/router";

export default function Page() {
    const router = useRouter();
    const { id } = router.query;

    // console.log(id) undefined

    return <h1>Book id : {id}</h1>
}

// 접속 시, 보통은 404 Not Found 페이지가 나타나지만 대괄호를 2개 붙여줌으로서 id가 없더라도
// 기본적인 HTML 화면을 보여주는 범용적인 페이지가 된다.
```

## 404 페이지 만들기

1. pages에 404.tsx 파일 생성 후, 기존에 작성하던 방식대로 Page 함수를 생성한다.
2. 지원하지 않는 URL 형식에 접근할 경우 404 페이지를 띄우게 된다.

```
// Directory : src/pages/404.tsx
// URL : http://localhost:3000/boo

exprot default Page() {
    return <h1>존재하지 않는 페이지입니다.</h1>
}
```

## 페이지간 이동을 위한 Navigation 바 생성

페이지 간 이동은 anchor 태그가 아닌 next 에서 지원하는 Link 컴포넌트를 사용한다.  
Link 컴포넌트는 Anchor와 같은 사용법과 동일하고 페이지 이동을 담당한다.

```
import "@/styles/globals.css";
import type { AppProps } from "next/app"
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <header>
                <Link href={"/"}>index</Link>
                <Link href={"/search?q=1"}>Search</Link>
                <Link href={"/book/1"}>Book</Link>
            </header>
            <Component {...pageProps}>
        </>
    )
}
```

## Programmatic Navigation

특정 버튼이 클릭되거나 특정 조건이 만족되었을 때, 함수 내부에서 페이지를 이동하는 방식

```
import "@/styles/globals.css";
import type { AppProps } from "next/app"
import Link from "next/link";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    const onClick = () => {
        router.push("/test");
    }

    return (
        <>
            <header>
                <Link href={"/"}>index</Link>
                <Link href={"/search?q=1"}>Search</Link>
                <Link href={"/book/1"}>Book</Link>
                <div>
                    <button onClick={onClick}>/test 페이지로 이동</button>
                </div>
            </header>
            <Component {...pageProps}>
        </>
    )
}
```

router의 push 메서드를 제외하고도 뒤로가기를 방지하며 페이지를 이동하는 replace 혹은 ..  
페이지를 뒤로 이동하는 back 메서드가 있다.

## Pre-Fetching ( 프리 페칭 )

사용자가 이동할 것으로 예상되는 페이지를 사전에 미리 불러오는 것인데,  
지체없이 빠르게 페이지 이동을 돕기 위한 기능이라고 생각하면 된다.

그런데, FCP와 TTI가 완료된 이후로는 CSR로 동작한다고 하는데, 왜 필요한가 ..?

이유는 현재 페이지에 대한 번틀 파일만을 전달하는데, 이 경우 다른 화면들에 접속할 경우 또 번들 파일을 가져와야 한다.  
하지만, 이 방식은 비효율적으로 첫 FCP, TTI의 성능은 좋더라도 이후 다른 페이지에 접속하는 경우 비효율적일 수 있다.

따라서 첫 화면을 렌더링하고 나중에 현재 화면과 연결된 링크들을 미리 프리 페칭하여 CSR 동작이 가능하도록 처리하는 것이다.

### 예외적인 요소

Link 컴포넌트로 연결된 링크가 아닌 특정 조건으로 이동하는 페이지의 경우, 프리 페칭이 안될 수 있다.

이 경우엔 router의 prefetch 메서드로 프리 페칭을 추가적으로 진행할 페이지 링크를 작성해 주면 빌드 화면에서  
정상적으로 프리 페칭 되는 모습을 확인할 수 있다.

### 프리 페칭 해제하는 방법

Link 컴포넌트로 연결된 링크의 경우 기본적으로 프리 페칭이 진행된다.  
프리 페칭이 필요하지 않는 페이지라고 생각될 경우, Link 컴포넌트의 속성으로 prefetch={false} 를 담아주면 ..  
프리 페칭이 진행되지 않고 접속 시 처리된다.

```
<Link href="/search?q=1" prefetch={false}>Search</Link>
```

## API Routes

API를 구축할 수 있는 기능이다.

이 기능을 활용할 경우, 백엔드에 요청하는 방법처럼 간단한 데이터를 직접 처리할 수 있다.

pages/api 폴더에 작성된 파일을 기준으로 요청에 대한 값을 함수 내부에서 req, res 매개변수로 응답할 수 있다.

## 페이지 별 레이아웃 설정

페이지 별 레이아웃을 설정하기 위해서는 \_app.tsx가 아닌 각 페이지를 담당하는 파일에서 처리해야 한다.

처리 방법으로는 각 페이지 별 함수에 메서드를 추가한다. 이때 메서드 이름은 알아보기 쉬운 용어로 작성한다.

```
export default function Page() {
    return <h1>Title</h1>
}

Page.getLayout = (page: ReactNode) => {
    return <SearchableLayout>{page}</SearchableLayout>
}
```

그리고 App 컴포넌트에서 컴포넌트를 실행하면서 getLayout 메서드를 같이 실행하여 레이아웃을 반환하도록 한다.

```
import GlobalLayout from "@/components/global-layout";
import "@/styles/globals.css";

import type { ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export default function App({
  Component,
  pageProps,
}: AppProps & { Component: NextPageWithLayout }) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  return <GlobalLayout>{getLayout(<Component {...pageProps} />)}</GlobalLayout>;
}

```

여기서 getLayout은 개별적으로 메서드를 추가했기 때문에 getLayout이 없는 컴포넌트의 경우,  
App 컴포넌트에서 페이지를 실행할 때, getLayout이 없는 컴포넌트의 undefined을 함수로 실행하려고 할 수 있다.

이 경우 에러가 발생하며, getLayout 메서드가 없는 경우 ?? 예외 처리를 진행해서 자체적인 page node를 반환한다.

## getServerSideProps ( SSR ) 처리

컴포넌트를 불러오는 중에 getServerSideProps 라는 이름으로 함수를 상단에 선언하면,  
서버에서 화면을 렌더링하면서 필요한 데이터를 미리 가져와 화면을 구성하고 전달하는 형태로 기능 설정이 가능하다.

사용 방법은 간단하다. 아래 예시로 작성해 보겠다.

```
export const getServerSideProps = () => {
  // 컴포넌트보다 먼저 실행 후, 컴포넌트에 필요한 데이터를 불러오는 함수 ( SSR 방식 )

  return {
    props: {
      data: "",
    },
  };
};

export default function Home({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    // ... JSX.Element
  );
}

Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};

```

이런 식으로 서버에서 미리 페칭을 진행하고 Response 로 받은 { props: Object } 형태의 데이터를 컴포넌트로 전달할 수 있다.  
전달된 데이터는 바로 컴포넌트에서 처리하고 렌더링된 화면을 클라이언트로 보내 렌더링하게 된다.

그런데, props로 전달된 data 값의 type을 추론하려면 어떻게 해야할까?  
그 방법은 Next에서 자체 제공하는 InferGetServerSidePropsType 타입을 활용하면 된다.

이 타입을 활용할 경우, 해당 컴포넌트 상단에 위치한 getServerSideProps의 반환 값을 추론하여 타입을 제공해 주는 형식이다.  
이건 그냥 자동으로 되는 것이 아닌 제네릭으로 해당 함수를 typeof로 반환 값을 알려주어야 한다.

## getStaticProps ( SSG ) 처리

SSG (Static Side Generation) 는 정적 페이지를 제공하는 렌더링 방식이다.

이 경우, 빌드 타임에 미리 데이터 페칭을 진행하여 페이지를 구성하고 정적인 HTML 파일을 빌드 파일에 담아주는 방식으로  
사용자가 브라우저로 접속 요청을 보냈을 때, 미리 만들어 둔 페이지를 전달하여 빠른 응답 효과를 볼 수 있게 된다.

단, 빌드 타임에 미리 만들어 두는 데이터이므로 빌드를 하지 않는 이상 정보를 최신화하지 못하기에  
사용할 땐, 적절한 지 한번 더 고민해 보는 것이 좋다.

## getStaticProps context.query 대응하기

SSG의 경우, 빌드 타임에 미리 HTML을 생성하는 방식으로 동작하는데,  
이 과정에서 URL의 query가 어떤 내용이 담겨 있을 지 알 수 없기에 처리가 불가능하다.

해결 방법은 StaticProps로 데이터를 받는 방식이 아닌 기존 방식으로 리액트처럼 CSR 형태로 동작하도록 하는 것이다.

이런 경우, 기본적으로 SSG로 동작하기에 fetch를 통해 가져와야할 데이터는 미리 생성하지 않고,  
먼저, fetch 동작이 필요 없는 UI를 구성하고 화면에 전달하여 추가적으로 브라우저에서 번들 파일로 fetch 를 진행한다.

이렇게 얻은 데이터를 클라이언트에서 렌더링하여 화면을 구성하게 되는 방식으로 구현이 가능하다.

## getStaticProps 동적 경로에 적용하기

[id].tsx 형식으로 params 를 얻어와야하는 형태의 페이지는 동적 경로로 ..  
미리 생성하기 위해서는 가져올 id를 미리 지정하여 빌드 타임에 생성할 수 있도록 직접 설정하여야 한다.

params를 설정하는 방법은 getStaticProps에서 모든 Books의 id를 가져오거나 직접 지정하면 된다.

예를 들어, [{ params: "1" }, { params: "2" }] 형태로 getStaticPaths를 활용해서 반환하면  
getStaticProps에서 context.params!.id 를 통해 받아와 해당하는 페이지들을 생성한다.

하지만 이 경우, 존재하지 않는 아이디를 가진 페이지로 이동을 한다면 404 Not Found 페이지로 이동이 될 것이다.  
그러면 fallback을 통해 이런 경우에 대해 대응이 가능하다.

## SSG fallback 기능 활용하기

fallback의 설정 값으로는 3개가 존재한다. 설정 값은 true, false, "blocking"이 있다.

1. true : 브라우저로부터 존재하지 않는 페이지를 요청할 경우, 즉시 Props 없는 페이지를 반환한다. ( 렌더링 가능한 UI만 제공 )

   - 없으면 현재 렌더링 가능한 UI만 제공하고 나중에 추가되었을 경우, "blocking"과 같은 효과를 볼 수 있다.

2. false : 존재하지 않는 아이디의 페이지를 접속할 경우, 404 Not Found를 제공한다. ( 기본 값 )
3. "blocking" : 이 경우 생성되지 않는 아이디의 페이지를 접속하면 그 즉시, 빌드 타임에 생성하던 것과 동일하게 새로운 HTML을 생성하여 제공한다.

## SSG notFound 기능 활용하기

fallback 이후에도 book 데이터가 없는 경우, NotFound 화면을 보여주고 싶다면 getStaticProps에서 return 값에 notFound: true를 담아 보내주면 된다.

## ISR ( Incremental Static Regeneration ) 증분 | 정적 | 재생성

ISR이란 SSG 방식으로 생성된 정적 페이지를 일정 주기로 다시 생성하는 방식이다.

자세히 설명하자면, 빌드 타임에 SSG와 동일하게 미리 생성한 후에 접속 요청 시 그대로 미리 생성된 HTML을 보낸다.  
60초로 설정했다면 60초 이후에 요청일 발생할 경우, 기존 HTML을 반환한 후 다시 빌드하여 다음 요청 시 새로운 HTML을 전달한다.

이 렌더링은 기존 SSG 방식의 장점인 매우 빠른 속도의 응답과 더불어 최신 데이터를 반영할 수 있는 기능을 가지게 된다.

## ISR - 주문형 재 검증 ( On-Demand-ISR )

On-Demand-ISR은 요청을 받을 때마다 페이지를 다시 생성하는 기법이다.

pages/api 하위에 revalidate.ts 과 같이 파일을 생성 ( 이름은 원하는 대로 ) 하여 response의 revalidate 메서드를 통해  
업데이트하고자 하는 페이지 링크를 입력해 준다.

해당 API로 요청이 올 경우, revalidate 처리에 성공한다면 입력한 링크의 HTML 파일을 다시 업데이트 해 주게 된다.
