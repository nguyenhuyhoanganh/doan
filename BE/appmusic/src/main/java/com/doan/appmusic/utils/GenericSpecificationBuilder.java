package com.doan.appmusic.utils;

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

    public GenericSpecificationBuilder with(String key, String operation, Object value, String predicateType) {
        params.add(new SearchCriteria(key, operation, value, predicateType));
        return this;
    }

    @SuppressWarnings("unchecked")
    public <T> Specification<T> build() {
        if (params.size() == 0) {
            return null;
        }

        List<Specification> specs = params.stream().map(x -> getSpecification(x)).collect(Collectors.toList());
        // x là param là

        Specification result = specs.get(0);

        for (int i = 1; i < params.size(); i++) {
            result = params.get(i - 1).isOrPredicate() ? Specification.where(result).or(specs.get(i))
                    : Specification.where(result).and(specs.get(i));
        }
        return result;
    }

    public <T> Specification<T> getSpecification(SearchCriteria criteria) {
        Specification<T> specification = new Specification<T>() {
            @Override
            public Predicate toPredicate(Root<T> root, CriteriaQuery<?> criteriaQuery,
                                         CriteriaBuilder criteriaBuilder) {
                Predicate predicate = genericCriteria(criteria, root, criteriaBuilder);
                return predicate;
            }
        };
        return specification;
    }

    public Predicate genericCriteria(SearchCriteria criteria, Root<?> root, CriteriaBuilder builder) {

        if (criteria.getOperation().equalsIgnoreCase(">")) {
            return builder.greaterThanOrEqualTo(root.get(criteria.getKey()), criteria.getValue().toString());
        } else if (criteria.getOperation().equalsIgnoreCase("<")) {
            return builder.lessThanOrEqualTo(root.get(criteria.getKey()), criteria.getValue().toString());
        } else if (criteria.getOperation().equalsIgnoreCase(":")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return builder.like(root.get(criteria.getKey()), "%" + criteria.getValue() + "%");
            } else if (root.get(criteria.getKey()).getJavaType() == Long.class
                    || root.get(criteria.getKey()).getJavaType() == Integer.class) {
                return builder.equal(root.get(criteria.getKey()), criteria.getValue());
            } else {
                Join join = root.join(criteria.getKey());
                String attributeName = criteria.getPredicateType().toLowerCase() + "Name";
                return builder.equal(join.get(attributeName), criteria.getValue());
            }
        }
        return null;
    }
}
