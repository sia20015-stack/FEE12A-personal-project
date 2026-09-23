package com.diary.diary.Memo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "memo", uniqueConstraints = {@UniqueConstraint(columnNames = {"username", "year", "month"})})
public class Memo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int year;
    private int month;
    private String username;

    @Column(columnDefinition = "TEXT")
    private String memo;
}
