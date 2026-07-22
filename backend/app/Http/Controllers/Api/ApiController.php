<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    use ApiResponseTrait;

    protected function getPerPage(Request $request): int
    {
        return $request->input('per_page', 15);
    }

    protected function getSort(Request $request): array
    {
        return [
            'field' => $request->input('sort_by', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];
    }
}