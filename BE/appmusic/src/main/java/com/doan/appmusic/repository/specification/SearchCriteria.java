package com.doan.appmusic.repository.specification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchCriteria<P, J> {
    private String key;
    private String operation;
    private Object value;
    private Class predicateType;
    private Class joinType = null;
    private boolean isOrPredicate = false;

    public SearchCriteria(String key, String operation, Object value, Class predicateType) {
        this.key = key;
        this.operation = operation;
        this.value = value;
        this.predicateType = predicateType;
    }
}
