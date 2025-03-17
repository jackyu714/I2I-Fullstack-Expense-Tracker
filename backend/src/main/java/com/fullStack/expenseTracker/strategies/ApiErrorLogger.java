package com.fullStack.expenseTracker.strategies;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;

public class ApiErrorLogger {

    /**
     * Logs errors encountered during API calls to the main service. 
     * Captures the error details and stores them for later analysis.
     *
     * @param errorMessage The error message encountered during the API request.
     * @param apiUrl The URL of the API that failed.
     * @param statusCode The HTTP status code returned by the API.
     */
    public void logError(String errorMessage, String apiUrl, int statusCode) {
        String logEntry = String.format("Timestamp: %s, Error: %s, API: %s, Status Code: %d%n", 
                                         LocalDateTime.now(), errorMessage, apiUrl, statusCode);
        
        try (FileWriter fileWriter = new FileWriter("api_error_log.txt", true)) {
            fileWriter.write(logEntry);
        } catch (IOException e) {
            System.err.println("Failed to log error: " + e.getMessage());
        }
    }
}
