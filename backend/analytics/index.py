import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get barbershop analytics data
    Args: event with httpMethod
    Returns: Analytics data with bookings stats, master workload, time distribution
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT 
            DATE(created_at) as date,
            COUNT(*) FILTER (WHERE status = 'completed') as completed,
            COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
            COUNT(*) FILTER (WHERE status = 'active') as active
        FROM bookings
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date
    """)
    bookings_timeline = cur.fetchall()
    
    cur.execute("""
        SELECT 
            m.name,
            COUNT(*) as total_bookings,
            COUNT(*) FILTER (WHERE b.status = 'completed') as completed
        FROM masters m
        LEFT JOIN bookings b ON m.id = b.master_id
        GROUP BY m.id, m.name
        ORDER BY total_bookings DESC
    """)
    masters_stats = cur.fetchall()
    
    cur.execute("""
        SELECT 
            EXTRACT(HOUR FROM booking_time) as hour,
            COUNT(*) as bookings_count
        FROM bookings
        WHERE status = 'completed'
        GROUP BY hour
        ORDER BY hour
    """)
    time_distribution = cur.fetchall()
    
    cur.execute("""
        SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'completed') as completed,
            COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
            COUNT(*) FILTER (WHERE status = 'active') as active
        FROM bookings
    """)
    totals = cur.fetchone()
    
    cur.close()
    conn.close()
    
    result = {
        'timeline': [dict(row) for row in bookings_timeline],
        'masters': [dict(row) for row in masters_stats],
        'timeDistribution': [{'hour': int(row['hour']), 'count': row['bookings_count']} for row in time_distribution],
        'totals': dict(totals)
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result, default=str),
        'isBase64Encoded': False
    }
