import * as _ from "lodash";

export function applicantReview(_step, _status_message, _next_step, _email = ``) {

    let update_obj = {
        status_step: _next_step,
        status_message: ``,
        email: _email,
    };

    if (update_obj.email === ``) _.omit(update_obj, ['email']);

    return update_obj;
}