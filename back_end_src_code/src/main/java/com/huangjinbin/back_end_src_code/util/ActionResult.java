package com.huangjinbin.back_end_src_code.util;

/**
 * 通用接口返回包装：ActionResult
 * 约定：code == 0 表示成功，message 默认 "success"
 */
public class ActionResult<T> {
    private int code;
    private String message;
    private T data;

    public ActionResult() {}

    public ActionResult(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> ActionResult<T> success(T data) {
        return new ActionResult<>(0, "success", data);
    }

    public static <T> ActionResult<T> fail(int code, String message) {
        return new ActionResult<>(code, message, null);
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
