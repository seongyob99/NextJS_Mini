import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function TodoDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;


    useEffect(() => {
        if (!id) return;

        axios.get(`${baseURL}/todos/${id}`)
            .then(res => {
                setTodo(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-center mt-5">로딩 중...</div>;
    if (!todo) return <div className="text-center mt-5">할 일을 찾을 수 없습니다.</div>;

    return (
        <div className="container mt-5" style={{ maxWidth: '1000px' }}>
            <h2 className="mb-4">할 일 상세보기</h2>

            <div className="mb-3">
                <strong><label className="form-label">제목</label></strong>
                <div className="form-control">{todo.title}</div>
            </div>

            <div className="mb-3">
                <strong><label className="form-label">내용</label></strong>
                <div className="form-control" style={{ minHeight: '100px' }}>{todo.content}</div>
            </div>

            <div className="mb-3">
                <p><strong>등록일:</strong> {new Date(todo.createdAt).toLocaleString()}</p>
            </div>

            <div className="mb-3">
                <strong><label className="form-label">상태</label></strong>
                <div className="form-control">{todo.completed ? '✅ 완료됨' : '🕒 미완료'}</div>
            </div>

            <Link href="/" className="btn btn-secondary me-2">목록으로</Link>
            <Link href={`/todos/${id}/edit`} className="btn btn-primary">수정하기</Link>
        </div>
    );
}
