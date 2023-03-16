package com.doan.appmusic.repository.specification;

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

    public <T> Specification<T> build() {
        if (params.size() == 0) {
            return null;
        }

        List<Specification> specs = params.stream().map(x -> getSpecification(x)).collect(Collectors.toList());

        Specification result = specs.get(0);

        for (int i = 1; i < params.size(); i++) {
            result = params.get(i - 1).isOrPredicate() ? Specification.where(result).or(specs.get(i)) : Specification.where(result).and(specs.get(i));
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

        Expression<String> expression;
        Class typeKey;
        // check joinType != null
        if (criteria.getJoinType() != null) {
            String[] keys = criteria.getKey().split("\\.");
            // join 2 tables
            Join join = root.join(keys[0], JoinType.INNER);
            expression = join.get(keys[1]);
            typeKey = criteria.getJoinType().getDeclaredField(keys[1]).getType();
        } else {
            expression = root.get(criteria.getKey());
            typeKey = root.get(criteria.getKey()).getJavaType();
        }

        // greater than
        if (criteria.getOperation().equalsIgnoreCase(">")) {
            return builder.greaterThanOrEqualTo(expression, criteria.getValue().toString());
        }
        // less than
        if (criteria.getOperation().equalsIgnoreCase("<")) {
            return builder.lessThanOrEqualTo(expression, criteria.getValue().toString());
        }
        // like or equal
        if (criteria.getOperation().equalsIgnoreCase("=")) {
            // like
            if (typeKey == String.class) return builder.like(expression, "%" + criteria.getValue().toString() + "%");
            // equal
            return builder.equal(expression, criteria.getValue().toString());
        }
        return null;
    }
}
