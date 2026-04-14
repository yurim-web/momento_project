package me.sejoon.yurim.blog.momento.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import me.sejoon.yurim.blog.momento.entity.CoupleLink;

public interface CoupleLinkRepository extends JpaRepository<CoupleLink, Long> {
    Optional<CoupleLink> findByInviteCode(String inviteCode);
    Optional<CoupleLink> findByOwnerEmail(String ownerEmail);
    Optional<CoupleLink> findByOwnerEmailOrPartnerEmail(String ownerEmail, String partnerEmail);
}
