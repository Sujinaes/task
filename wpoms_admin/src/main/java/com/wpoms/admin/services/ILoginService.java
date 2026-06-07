package com.wpoms.admin.services;

import com.wpoms.admin.models.payloads.LoginPayload;
import com.wpoms.admin.models.response.LoginResponse;

public interface ILoginService {

    LoginResponse login(LoginPayload payload);

}
