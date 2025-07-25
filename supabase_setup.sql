-- Baseball Evaluation System Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create evaluations table
CREATE TABLE evaluations (
    id BIGSERIAL PRIMARY KEY,
    player_name TEXT NOT NULL,
    evaluator_name TEXT NOT NULL,
    evaluation_type TEXT NOT NULL CHECK (evaluation_type IN ('pitching', 'infield', 'outfield', 'batting', 'catching', 'speed')),
    velocity NUMERIC(5,2) NULL, -- Only for pitching evaluations
    ratings JSONB NOT NULL, -- Array of {criteria: string, rating: number}
    notes TEXT NULL, -- Optional notes for the evaluation
    average_score NUMERIC(3,2) NOT NULL CHECK (average_score >= 2 AND average_score <= 8),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_evaluations_player_name ON evaluations(player_name);
CREATE INDEX idx_evaluations_evaluator_name ON evaluations(evaluator_name);
CREATE INDEX idx_evaluations_type ON evaluations(evaluation_type);
CREATE INDEX idx_evaluations_created_at ON evaluations(created_at DESC);
CREATE INDEX idx_evaluations_average_score ON evaluations(average_score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is for public tryouts)
-- You can make this more restrictive later if needed
CREATE POLICY "Allow all operations on evaluations" ON evaluations
    FOR ALL USING (true) WITH CHECK (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_evaluations_updated_at 
    BEFORE UPDATE ON evaluations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy statistics
CREATE VIEW evaluation_stats AS
SELECT 
    evaluation_type,
    COUNT(*) as total_evaluations,
    ROUND(AVG(average_score), 2) as avg_score,
    MIN(average_score) as min_score,
    MAX(average_score) as max_score,
    COUNT(DISTINCT player_name) as unique_players
FROM evaluations
GROUP BY evaluation_type;

-- Create a view for player summaries
CREATE VIEW player_summary AS
SELECT 
    player_name,
    COUNT(*) as total_evaluations,
    ROUND(AVG(average_score), 2) as overall_avg,
    ARRAY_AGG(DISTINCT evaluation_type) as evaluation_types,
    MAX(created_at) as last_evaluation
FROM evaluations
GROUP BY player_name
ORDER BY overall_avg DESC;

-- Insert some sample data for testing (optional)
INSERT INTO evaluations (player_name, evaluator_name, evaluation_type, ratings, average_score) VALUES
('John Smith', 'Coach Johnson', 'pitching', '[{"criteria": "Mechanics", "rating": 7.5}, {"criteria": "Control", "rating": 6.0}]', 6.75),
('Mike Johnson', 'Coach Smith', 'batting', '[{"criteria": "Mechanics", "rating": 8.0}, {"criteria": "Contact", "rating": 7.0}, {"criteria": "Power", "rating": 6.5}]', 7.17),
('Sarah Davis', 'Coach Williams', 'infield', '[{"criteria": "Range/Feet", "rating": 7.0}, {"criteria": "Glove", "rating": 8.0}, {"criteria": "Mechanics", "rating": 6.0}, {"criteria": "Arm Strength", "rating": 7.5}]', 7.13);

-- Add velocity to the pitching sample
UPDATE evaluations 
SET velocity = 88.5 
WHERE player_name = 'John Smith' AND evaluation_type = 'pitching';

COMMENT ON TABLE evaluations IS 'Stores all baseball player evaluations from tryouts';
COMMENT ON COLUMN evaluations.ratings IS 'JSON array of criteria and ratings: [{"criteria": "name", "rating": number}]';
COMMENT ON COLUMN evaluations.velocity IS 'Pitch velocity in MPH (only for pitching evaluations)';
COMMENT ON VIEW evaluation_stats IS 'Aggregated statistics by evaluation type';
COMMENT ON VIEW player_summary IS 'Player performance summary across all evaluations';