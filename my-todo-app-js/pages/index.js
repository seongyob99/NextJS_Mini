import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from '../styles/Todo.module.css';
import searchStyles from '../styles/SearchBar.module.css';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState('all'); // 전체, 완료, 미완료

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ✅ filter 또는 keyword 변경 시 초기화 후 fetch
  useEffect(() => {
    resetAndFetch();
  }, [filter, keyword]);

  const resetAndFetch = () => {
    setTodos([]);
    setLastId(null);
    setHasMore(true);
    fetchTodos(true);
  };

  const fetchTodos = async (isNewSearch = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.get(`${baseURL}/todos/${keyword ? 'search' : 'cursor'}`, {
        params: {
          keyword: keyword || undefined,
          completed:
            filter === 'completed'
              ? true
              : filter === 'incomplete'
                ? false
                : undefined,
          cursorId: isNewSearch ? null : lastId,
          size: 4,
        },
      });

      const newTodos = res.data;
      setTodos((prev) => (isNewSearch ? newTodos : [...prev, ...newTodos]));

      if (newTodos.length > 0) {
        setLastId(newTodos[newTodos.length - 1].id);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // keyword 변경은 상태에 반영되고, useEffect가 감지해서 fetch 실행
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    // useEffect가 filter 변경을 감지해서 자동 fetch 실행
  };

  return (
    <div className="container mt-5">
      {/* 한 줄 정렬: 추가, 검색창+버튼, 필터버튼 */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">

        {/* 할 일 추가하기 */}
        <Link href="/add" className="btn btn-primary">
          할 일 추가하기
        </Link>

        {/* 검색창 + 검색 버튼 */}
        <form className="d-flex align-items-center" onSubmit={handleSearch}>
          <input
            type="text"
            className={`${searchStyles.searchInput} form-control me-2`}
            placeholder="검색어 입력"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className={`${searchStyles.searchButton} btn btn-primary`}>
            검색
          </button>
        </form>

        {/* 필터 버튼 */}
        <div className="btn-group">
          <button
            className={`btn btn-secondary ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            전체
          </button>
          <button
            className={`btn btn-success ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('completed')}
          >
            완료
          </button>
          <button
            className={`btn btn-warning ${filter === 'incomplete' ? 'active' : ''}`}
            onClick={() => handleFilterChange('incomplete')}
          >
            미완료
          </button>
        </div>
      </div>

      {/* 목록 */}
      <div className="row">
        {todos.map((todo) => (
          <div className="col-md-3" key={todo.id}>
            <Link href={`/todos/${todo.id}`} className="text-decoration-none text-dark">
              <div className={`card mb-4 ${styles.fixedCard}`}>
                <div className="card-body">
                  <h5 className="card-title">{todo.title}</h5>
                  <p className={`card-text ${styles.cardText}`}>{todo.content}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      등록일: {new Date(todo.createdAt).toLocaleDateString()}
                    </small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      {todo.completed ? '✅ 완료' : '🕒 미완료'}
                    </small>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-4">
          <button onClick={() => fetchTodos()} className="btn btn-outline-secondary">
            더 보기
          </button>
        </div>
      )}
    </div>
  );
}
