<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponseTrait
{
    /**
     * Success Response
     */
    protected function success($data = null, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Error Response
     */
    protected function error(string $message = 'Error', int $code = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    /**
     * Paginated Response
     */
    protected function paginated($data, $resource = null, string $message = 'Success', int $code = 200): JsonResponse
    {
        $items = $data->items();
        
        if ($resource instanceof \Illuminate\Http\Resources\Json\AnonymousResourceCollection || is_array($resource)) {
            $items = $resource;
        } elseif (is_string($resource)) {
            $message = $resource;
        }

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $items,
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
                'next_page_url' => $data->nextPageUrl(),
                'prev_page_url' => $data->previousPageUrl(),
            ],
        ], $code);
    }
}