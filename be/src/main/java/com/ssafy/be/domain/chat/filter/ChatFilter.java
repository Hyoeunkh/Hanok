package com.ssafy.be.domain.chat.filter;

import java.util.List;

public class ChatFilter {

    private static final List<String> BANNED_WORDS = List.of("욕설1", "욕설2");

    public boolean isFiltered(String content) {
        return BANNED_WORDS.stream()
                .anyMatch(content::contains);
    }
}
