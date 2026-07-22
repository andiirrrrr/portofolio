<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    public function run()
    {
        Contact::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'subject' => 'Project Inquiry',
            'message' => 'I would like to discuss a potential project with you. Please let me know your availability.',
            'phone' => '08123456789',
            'is_read' => false,
            'is_replied' => false,
        ]);
    }
}