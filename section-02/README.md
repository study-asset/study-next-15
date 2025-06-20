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

import { useRouter } = "next/router";

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

import { useRouter } = "next/router";

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

import { useRouter } = "next/router";

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

import { useRouter } = "next/router";

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
