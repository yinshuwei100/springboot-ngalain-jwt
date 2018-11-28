package cn.cib.action.bean;

import lombok.*;

@Getter
@Setter
@Builder
@ToString(doNotUseGetters = true)
@AllArgsConstructor
@NoArgsConstructor
public class SalesData {
    private String x;
    private int y;
}
