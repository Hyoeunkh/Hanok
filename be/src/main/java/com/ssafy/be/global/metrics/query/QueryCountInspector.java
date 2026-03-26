package com.ssafy.be.global.metrics.query;

import org.hibernate.resource.jdbc.spi.StatementInspector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class QueryCountInspector implements StatementInspector {

    private static final Logger log = LoggerFactory.getLogger(QueryCountInspector.class);

    @Override
    public String inspect(String sql) {
        log.info("QueryCountInspector.inspect thread={}", Thread.currentThread().getName());

        RequestContext ctx = RequestContextHolder.getContext();

        if (ctx == null) {
            log.info(
                    "QueryCountInspector.skipCount reason=no RequestContext thread={}",
                    Thread.currentThread().getName());
            return sql;
        }

        ctx.incrementQueryCount(sql);
        return sql;
    }
}

