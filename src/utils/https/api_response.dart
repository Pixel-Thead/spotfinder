class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;
  final dynamic meta;
  final String? token;
  final dynamic error;

  ApiResponse({
    required this.success,
    required this.message,
    this.data,
    this.meta,
    this.token,
    this.error,
  });
}
