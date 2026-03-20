package com.ssafy.be.domain.bottomauction.repository;

import com.ssafy.be.domain.bottomauction.entity.BottomUpAuctionDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BottomUpAuctionDetailRepository extends JpaRepository<BottomUpAuctionDetail, Long> {
    Optional<BottomUpAuctionDetail> findByAuction_Id(Long auctionId);
}
