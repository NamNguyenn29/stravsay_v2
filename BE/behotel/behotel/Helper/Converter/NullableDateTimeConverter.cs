﻿using System.Text.Json;
using System.Text.Json.Serialization;

public class NullableDateTimeConverter : JsonConverter<DateTime?>
{
    public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            var value = reader.GetString();
            if (string.IsNullOrWhiteSpace(value))
                return null;
            if (DateTime.TryParse(value, out var date))
                return date;
        }
        else if (reader.TokenType == JsonTokenType.Null)
        {
            return null;
        }
        return null;
    }

    public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
    {
        if (value.HasValue)
            writer.WriteStringValue(value.Value.ToString("yyyy-MM-ddTHH:mm:ss"));
        else
            writer.WriteNullValue();
    }
}
