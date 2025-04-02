package com.busanit501.mynextjs_back.repository;

import com.busanit501.mynextjs_back.domain.Todo;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    // ✅ 기본 커서 페이징
    List<Todo> findAllByOrderByIdDesc(Pageable pageable);
    List<Todo> findByIdLessThanOrderByIdDesc(Long id, Pageable pageable);

    // ✅ completed 필터용
    List<Todo> findByCompletedOrderByIdDesc(Boolean completed, Pageable pageable);
    List<Todo> findByIdLessThanAndCompletedOrderByIdDesc(Long id, Boolean completed, Pageable pageable);

    // ✅ 키워드 검색만 (단독용)
    List<Todo> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrderByIdDesc(
            String titleKeyword, String contentKeyword, Pageable pageable
    );

    // ✅ 검색 + 완료 필터링 + 커서 페이징 통합 (복합 조건)
    @Query("""
        SELECT t FROM Todo t
        WHERE (:cursorId IS NULL OR t.id < :cursorId)
        AND (:completed IS NULL OR t.completed = :completed)
        AND (
            LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(t.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        ORDER BY t.id DESC
    """)
    List<Todo> searchWithCursorAndFilter(
            @Param("keyword") String keyword,
            @Param("completed") Boolean completed,
            @Param("cursorId") Long cursorId,
            Pageable pageable
    );
}
