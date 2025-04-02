// pages/todos/[id]/edit.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function EditTodoPage() {
    const router = useRouter();
    const { id } = router.query;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        if (!id) return;
        axios.get(`${baseURL}/todos/${id}`)
            .then(res => {
                const data = res.data;
                setTitle(data.title);
                setContent(data.content);
                setCompleted(data.completed);
                setLoading(false);
            })
            .catch(err => {
                console.error('데이터 불러오기 실패', err);
                setLoading(false);
            });
    }, [id]);

    const handleSave = async () => {
        try {
            await axios.put(`${baseURL}/todos/${id}`, {
                title,
                content,
                completed,
            });
            router.push(`/todos/${id}`);
        } catch (err) {
            console.error('수정 실패', err);
        }
    };


    const handleDelete = async () => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`http://localhost:8080/api/todos/${id}`);
            router.push('/');
        } catch (err) {
            console.error('삭제 실패', err);
        }
    };

    if (loading) return <div className="container">로딩 중...</div>;

    return (
        <div className="container" style={{ maxWidth: '1000px', marginTop: '2rem' }}>
            <h1 className="mb-4">할 일 수정</h1>

            <div className="mb-3">
                <strong><label className="form-label">제목</label></strong>
                <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <strong><label className="form-label">내용</label></strong>
                <textarea
                    className="form-control"
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
            </div>

            <div className="mb-3">
                <strong><label className="form-label">상태</label></strong>
                <select
                    className="form-select"
                    value={completed ? '완료' : '미완료'}
                    onChange={(e) => setCompleted(e.target.value === '완료')}
                >
                    <option value="미완료">🕒 미완료</option>
                    <option value="완료">✅ 완료</option>
                </select>
            </div>

            <div className="d-flex gap-2">
                <button className="btn btn-secondary" onClick={() => router.back()}>취소</button>
                <button className="btn btn-primary" onClick={handleSave}>저장</button>
                <button className="btn btn-danger" onClick={handleDelete}>삭제</button>
            </div>
        </div>
    );
}
