# Display the environment variables
puts ENV.inspect

collect_cnt = tlm("<%= target_name %> HEALTH_STATUS COLLECTS")
cmd("<%= target_name %> COLLECT with DURATION 11, TYPE NORMAL")
cmd_no_range_check("<%= target_name %> COLLECT with DURATION 11, TYPE NORMAL")
cmd_no_hazardous_check("<%= target_name %> COLLECT with DURATION 11, TYPE NORMAL")
cmd_no_checks("<%= target_name %> COLLECT with DURATION 11, TYPE NORMAL")
wait_check("<%= target_name %> HEALTH_STATUS COLLECTS == #{collect_cnt + 2}", 10)
cmd("<%= target_name %> CLEAR")
cmd_no_range_check("<%= target_name %> CLEAR")
cmd_no_hazardous_check("<%= target_name %> CLEAR")
cmd_no_checks("<%= target_name %> CLEAR")
puts tlm("<%= target_name %> HEALTH_STATUS COLLECTS")
