package com.ridesharing.ridesharing.repository;

import com.ridesharing.ridesharing.entity.HelpSupport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HelpSupportRepository extends JpaRepository<HelpSupport, Long> {
    List<HelpSupport> findByEmailOrderByCreatedAtDesc(String email);
    List<HelpSupport> findByStatusOrderByCreatedAtDesc(String status);
}