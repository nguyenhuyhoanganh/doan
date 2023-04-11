package com.doan.appmusic.controller;

import com.doan.appmusic.model.CategoryDTO;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService service;

    @GetMapping("")
    public ResponseEntity<?> getAll(HttpServletRequest request, @RequestParam(required = false, defaultValue = "id") String[] sortBy, @RequestParam(required = false, defaultValue = "desc") String[] orderBy, @RequestParam(required = false, defaultValue = "1") Integer page, @RequestParam(required = false, defaultValue = "10") Integer limit) {

        page = page < 1 ? 1 : page;
        limit = limit < 0 ? 10 : limit;
        sortBy = sortBy.length == 0 ? new String[]{"id"} : sortBy;
        orderBy = orderBy.length == 0 ? new String[]{"desc"} : orderBy;

        Map<String, String[]> query = new HashMap<>(request.getParameterMap());
        query.remove("page");
        query.remove("limit");
        query.remove("sortBy");
        query.remove("orderBy");

        List<CategoryDTO> categories = service.getAll(page - 1, limit, sortBy, orderBy, query);
        long count = service.count(query);
        ResponseDTO<?> response = ResponseDTO.builder().data(categories).results(count).page(page).limit(limit).build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable long id) {
        CategoryDTO categoryDTO = service.getById(id);
        ResponseDTO<?> response = ResponseDTO.builder().data(categoryDTO).build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody CategoryDTO categoryDTO) {
        CategoryDTO categoryCreated = service.create(categoryDTO);
        ResponseDTO<?> response = ResponseDTO.builder().code(HttpStatus.CREATED.value()).data(categoryCreated).build();
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(categoryCreated.getId()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/modify/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO categoryUpdated = service.update(id, categoryDTO);
        ResponseDTO<?> response = ResponseDTO.builder().data(categoryUpdated).build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
