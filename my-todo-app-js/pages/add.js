// pages/add.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AddTodoPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) return;
        await axios.post(`${baseURL}/todos`, {
            title,
            content,
            completed: false,
        });
        router.push('/'); // 등록 후 메인으로 이동
    };

    return (
        <div className="container mt-5">
            <h1>할 일 추가</h1>

            <div className="mb-3">
                <input
                    type="text"
                    placeholder="제목 입력"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <textarea
                    placeholder="내용 입력"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="form-control"
                ></textarea>
            </div>
            <button onClick={handleSubmit} className="btn btn-primary">
                등록
            </button>
        </div>
    );
}
