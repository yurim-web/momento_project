package me.sejoon.yurim.blog.momento.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import me.sejoon.yurim.blog.momento.entity.CoupleLink;
import me.sejoon.yurim.blog.momento.repository.CoupleLinkRepository;

@Service
public class CoupleLinkService {

    private final CoupleLinkRepository repository;

    public CoupleLinkService(CoupleLinkRepository repository) {
        this.repository = repository;
    }

    public CoupleLink generateCode(String email) {
        // 이미 생성한 코드가 있으면 반환
        Optional<CoupleLink> existing = repository.findByOwnerEmail(email);
        if (existing.isPresent()) {
            return existing.get();
        }

        String code = "MOMENTO-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        CoupleLink link = new CoupleLink(code, email);
        return repository.save(link);
    }

    public CoupleLink connect(String inviteCode, String partnerEmail) {
        CoupleLink link = repository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 초대 코드입니다."));

        if (link.isConnected()) {
            throw new RuntimeException("이미 연결된 코드입니다.");
        }

        if (link.getOwnerEmail().equals(partnerEmail)) {
            throw new RuntimeException("자신의 코드로는 연결할 수 없습니다.");
        }

        link.setPartnerEmail(partnerEmail);
        link.setConnected(true);
        link.setConnectedAt(LocalDateTime.now());
        return repository.save(link);
    }

    public Optional<CoupleLink> getMyCouple(String email) {
        return repository.findByOwnerEmailOrPartnerEmail(email, email);
    }
}
