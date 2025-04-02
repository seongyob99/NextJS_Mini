package com.busanit501.mynextjs_back.controller;

import com.busanit501.mynextjs_back.domain.Todo;
import com.busanit501.mynextjs_back.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    // 전체 목록
    @GetMapping
    public List<Todo> getAll() {
        return todoRepository.findAll();
    }

    // 생성
    @PostMapping
    public Todo create(@RequestBody Todo todo) {
        return todoRepository.save(todo);
    }

    // 수정
    @PutMapping("/{id}")
    public Todo update(@PathVariable Long id, @RequestBody Todo update) {
        Todo todo = todoRepository.findById(id).orElseThrow();
        todo.setCompleted(update.isCompleted());
        todo.setTitle(update.getTitle());
        todo.setContent(update.getContent());
        return todoRepository.save(todo);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        todoRepository.deleteById(id);
    }

    // 상세 보기
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodo(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 기본 커서 기반 페이징
    @GetMapping("/cursor")
    public List<Todo> getTodosByCursor(
            @RequestParam(required = false) Long cursorId,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(0, size);

        // 🔥 조건 분기 처리 필요
        if (completed != null && cursorId != null) {
            return todoRepository.findByIdLessThanAndCompletedOrderByIdDesc(cursorId, completed, pageable);
        } else if (completed != null) {
            return todoRepository.findByCompletedOrderByIdDesc(completed, pageable);
        } else if (cursorId != null) {
            return todoRepository.findByIdLessThanOrderByIdDesc(cursorId, pageable);
        } else {
            return todoRepository.findAllByOrderByIdDesc(pageable);
        }
    }

    // 검색 + 완료 필터링 + 커서 페이징 통합
    @GetMapping("/search")
    public List<Todo> searchTodos(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "4") int size
    ) {
        Pageable pageable = PageRequest.of(0, size);
        String safeKeyword = keyword != null ? keyword : "";

        return todoRepository.searchWithCursorAndFilter(
                safeKeyword,
                completed,
                cursorId,
                pageable
        );
    }
}
