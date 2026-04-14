package me.sejoon.yurim.blog.momento.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "couple_links")
public class CoupleLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String inviteCode;

    @Column(nullable = false)
    private String ownerEmail;

    @Column
    private String partnerEmail;

    @Column(nullable = false)
    private boolean connected = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime connectedAt;

    public CoupleLink() {}

    public CoupleLink(String inviteCode, String ownerEmail) {
        this.inviteCode = inviteCode;
        this.ownerEmail = ownerEmail;
        this.connected = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getInviteCode() { return inviteCode; }
    public String getOwnerEmail() { return ownerEmail; }
    public String getPartnerEmail() { return partnerEmail; }
    public boolean isConnected() { return connected; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getConnectedAt() { return connectedAt; }

    public void setPartnerEmail(String partnerEmail) { this.partnerEmail = partnerEmail; }
    public void setConnected(boolean connected) { this.connected = connected; }
    public void setConnectedAt(LocalDateTime connectedAt) { this.connectedAt = connectedAt; }
}
