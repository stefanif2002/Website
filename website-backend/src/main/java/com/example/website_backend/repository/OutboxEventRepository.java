package com.example.website_backend.repository;

import com.example.website_backend.model.OutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {
    @Query(
            value = "SELECT * FROM outbox_event o "
                    + "WHERE o.processed = false "
                    + "AND o.ready_to_process = true "
                    + "AND o.aggregate_type IN (:types) "
                    + "LIMIT 100",
            nativeQuery = true
    )
    List<OutboxEvent> findByProcessedFalse(@Param("types") List<String> types);

    @Query(
            value = "SELECT * FROM outbox_event o "
                    + "WHERE o.aggregate_id = :id "
                    + "LIMIT 100",
            nativeQuery = true
    )
    List<OutboxEvent> findAllByAggregateId(Long id);
}
