package com.doan.appmusic.service;

import lombok.SneakyThrows;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class GenericSpecificationBuilder {
    private final List<SearchCriteria> params;

    public GenericSpecificationBuilder() {
        params = new ArrayList<SearchCriteria>();
    }

    public GenericSpecificationBuilder with(SearchCriteria searchCriteria) {
        params.add(searchCriteria);
        return this;
    }

    @SuppressWarnings("unchecked")
    public <T> Specification<T> build() {
        if (params.size() == 0) {
            return null;
        }

        List<Specification> specs = params.stream().map(x -> getSpecification(x)).collect(Collectors.toList());

        Specification result = specs.get(0);

        for (int i = 1; i < params.size(); i++) {
            result = Specification.where(result).and(specs.get(i));
//                    params.get(i - 1).isOrPredicate() ? Specification.where(result).or(specs.get(i))
//                    : Specification.where(result).and(specs.get(i));
        }
        return result;
    }

    public <T> Specification<T> getSpecification(SearchCriteria criteria) {
        Specification<T> specification = new Specification<T>() {
            @SneakyThrows
            @Override
            public Predicate toPredicate(Root<T> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                Predicate predicate = genericCriteria(criteria, root, criteriaBuilder);
                return predicate;
            }
        };
        return specification;
    }

    public Predicate genericCriteria(SearchCriteria criteria, Root<?> root, CriteriaBuilder builder) throws NoSuchFieldException {

        Join join = null;
        String[] keys = null;
        // check joinType != null
        if (criteria.getJoinType() != null) {
            keys = criteria.getKey().split("\\.");
            // join 2 tables
            join = root.join(keys[0], JoinType.INNER);
        }

        // greater than
        if (criteria.getOperation().equalsIgnoreCase(">")) {
            if (join != null) return builder.greaterThanOrEqualTo(join.get(keys[1]), criteria.getValue().toString());
            return builder.greaterThanOrEqualTo(root.get(criteria.getKey()), criteria.getValue().toString());
        }
        // less than
        if (criteria.getOperation().equalsIgnoreCase("<")) {
            if (join != null) return builder.lessThanOrEqualTo(join.get(keys[1]), criteria.getValue().toString());
            return builder.lessThanOrEqualTo(root.get(criteria.getKey()), criteria.getValue().toString());
        }
        // like or equal
        if (criteria.getOperation().equalsIgnoreCase("=")) {
            if (join != null) {
                // like
                if (criteria.getJoinType().getDeclaredField(keys[1]).getType() == String.class)
                    return builder.like(join.get(keys[1]), "%" + criteria.getValue().toString() + "%");
                // equal
                return builder.equal(join.get(keys[1]), criteria.getValue().toString());
            }
            // like
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return builder.like(root.get(criteria.getKey()), "%" + criteria.getValue() + "%");
            }
            // equal
            return builder.equal(root.get(criteria.getKey()), criteria.getValue());
        }
        return null;
    }
}
