import { db } from '@/db';
import { mockTestTable, questionBankTable } from '@/db/schema';
import { customPaginate } from '@/lib/customPaginate';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const {
            page = 1,
            limit = 10,
            searchCriterias = [],
            sortCriterias = [],
        } = await req.json();

        const queryBuilder = customPaginate(
            db,
            'mock_tests',
            mockTestTable,
            {
                page,
                limit,
                searchCriterias,
                sortCriterias,
            }
        );
        const result = await queryBuilder.execute();

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Error while getting data: ', error);
        return NextResponse.json(
            {
                message: 'Error while getting data',
                error: error.message,
            },
            { status: 500 }
        );
    }
}