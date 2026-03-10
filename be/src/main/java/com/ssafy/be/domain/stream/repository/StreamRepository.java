package com.ssafy.be.domain.stream.repository;

import com.ssafy.be.domain.stream.entity.Stream;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StreamRepository extends JpaRepository<Stream, Long> {
    Optional<Stream> findByIdAndSellerId(Long id, Long sellerId);
}